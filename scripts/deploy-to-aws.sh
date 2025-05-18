#!/bin/bash

# Deployment script for microservices to AWS using Terraform
# This script handles the two-stage deployment process

set -e

WORKSPACE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TERRAFORM_DIR="${WORKSPACE_DIR}/terraform"
SCRIPT_DIR="${WORKSPACE_DIR}/scripts"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed. Please install Terraform first.${NC}"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install AWS CLI first.${NC}"
    exit 1
fi

# Function to display usage
usage() {
    echo -e "Usage: $0 [OPTIONS]"
    echo -e "Options:"
    echo -e "  init                Initialize Terraform"
    echo -e "  stage1              Deploy infrastructure (databases, ECR, etc.)"
    echo -e "  stage2              Deploy microservices"
    echo -e "  all                 Run both stages"
    echo -e "  destroy             Destroy all resources"
    echo -e "  help                Show this help message"
}

# Function to initialize Terraform
init_terraform() {
    echo -e "${YELLOW}Initializing Terraform...${NC}"
    cd "${TERRAFORM_DIR}"
    terraform init
    echo -e "${GREEN}Terraform initialization complete.${NC}"
}

# Function to deploy stage 1 (infrastructure)
deploy_stage1() {
    echo -e "${YELLOW}Deploying Stage 1: Infrastructure (Databases, ECR, etc.)${NC}"
    cd "${TERRAFORM_DIR}"
    
    # First, deploy the networking components (VPC, subnets, IGW, route tables)
    echo -e "${YELLOW}Creating VPC and networking resources...${NC}"
    terraform apply -target=aws_vpc.main \
                   -target=aws_subnet.public \
                   -target=aws_internet_gateway.main \
                   -target=aws_route_table.public \
                   -target=aws_route_table_association.public \
                   -target=aws_security_group.ecs_tasks \
                   -target=aws_security_group.rds \
                   -auto-approve
    
    # Now create the database and other resources
    echo -e "${YELLOW}Creating databases and ECR repositories...${NC}"
    terraform plan -target=aws_db_parameter_group.postgres \
                  -target=aws_db_subnet_group.postgres \
                  -target=aws_db_instance.postgres \
                  -target=aws_ecs_cluster.main \
                  -target=aws_ecr_repository.services \
                  -out=stage1.tfplan
    
    # Apply the plan
    terraform apply stage1.tfplan
    
    # Extract ECR repository URLs and store them for later use
    terraform output -json ecr_repositories > "${TERRAFORM_DIR}/ecr_repos.json"
    
    echo -e "${GREEN}Stage 1 deployment complete.${NC}"
}

# Function to build and push Docker images
build_push_images() {
    echo -e "${YELLOW}Building and pushing Docker images to ECR...${NC}"
    
    cd "${TERRAFORM_DIR}"
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(terraform output -raw aws_region 2>/dev/null || echo "us-east-1")
    
    # Login to ECR
    echo -e "${YELLOW}Logging in to ECR in region ${AWS_REGION}...${NC}"
    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    # Check if jq is installed for JSON parsing
    if command -v jq &> /dev/null; then
        # Parse ECR repository URLs using jq
        ECR_REPOS=$(cat "${TERRAFORM_DIR}/ecr_repos.json" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"')
    else
        # Fallback method if jq is not available
        echo -e "${YELLOW}jq not found, using alternative method to get repository URLs...${NC}"
        # Get repository URLs directly from terraform output
        REPO_URLS=$(terraform output -json ecr_repositories)
        # Extract service names from terraform.tfvars
        SERVICE_NAMES=$(grep -o '"[^"]*-service"' "${TERRAFORM_DIR}/terraform.tfvars" | tr -d '"')
        
        # Build ECR_REPOS string manually
        ECR_REPOS=""
        for SERVICE_NAME in ${SERVICE_NAMES}; do
            REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SERVICE_NAME}"
            ECR_REPOS="${ECR_REPOS} ${SERVICE_NAME}=${REPO_URL}"
        done
    fi
    
    # Build and push each service
    for SERVICE_REPO in ${ECR_REPOS}; do
        SERVICE_NAME=$(echo "${SERVICE_REPO}" | cut -d'=' -f1)
        REPO_URL=$(echo "${SERVICE_REPO}" | cut -d'=' -f2)
        
        echo -e "${YELLOW}Building and pushing ${SERVICE_NAME} for linux/amd64...${NC}"
        
        # Build and push the Docker image for linux/amd64 using buildx
        docker buildx build --platform linux/amd64 -t "${REPO_URL}:latest" "${WORKSPACE_DIR}/${SERVICE_NAME}" --push
        
        echo -e "${GREEN}Successfully built and pushed ${SERVICE_NAME} to ECR.${NC}"
    done
    
    echo -e "${GREEN}All images have been built and pushed.${NC}"
}

# Function to deploy stage 2 (microservices)
deploy_stage2() {
    echo -e "${YELLOW}Deploying Stage 2: Microservices${NC}"
    cd "${TERRAFORM_DIR}"
    
    # Get project name from terraform.tfvars
    PROJECT_NAME=$(grep 'project_name' "${TERRAFORM_DIR}/terraform.tfvars" | cut -d '"' -f 2 || echo "microservices")
    
    # Check if load balancer already exists
    echo -e "${YELLOW}Checking if load balancer already exists...${NC}"
    LB_EXISTS=$(aws elbv2.describe-load-balancers --names "${PROJECT_NAME}-alb" --query 'LoadBalancers[0].LoadBalancerName' --output text 2>/dev/null || echo "")
    
    if [ -n "$LB_EXISTS" ]; then
        echo -e "${YELLOW}Load balancer ${PROJECT_NAME}-alb already exists, skipping its creation...${NC}"
        # Create a plan for stage 2 without the load balancer
        terraform plan -target=aws_ecs_task_definition.services \
                      -target=aws_ecs_service.services_with_lb \
                      -target=aws_lb_target_group.services \
                      -target=aws_lb_listener.http \
                      -target=aws_lb_listener_rule.services \
                      -out=stage2.tfplan
    else
        # Create a plan for stage 2 including the load balancer
        terraform plan -target=aws_ecs_task_definition.services \
                      -target=aws_ecs_service.services_with_lb \
                      -target=aws_lb.main \
                      -target=aws_lb_target_group.services \
                      -target=aws_lb_listener.http \
                      -target=aws_lb_listener_rule.services \
                      -out=stage2.tfplan
    fi
    
    # Apply the plan
    terraform apply stage2.tfplan
    
    # Display service endpoints
    terraform output -json service_urls
    
    echo -e "${GREEN}Stage 2 deployment complete.${NC}"
    echo -e "${GREEN}Deployment process completed successfully.${NC}"
    echo -e "${YELLOW}You can access your services at the URLs above.${NC}"
}

# Main script logic
case "$1" in
    init)
        init_terraform
        ;;
    stage1)
        init_terraform
        deploy_stage1
        ;;
    stage2)
        build_push_images
        deploy_stage2
        ;;
    all)
        init_terraform
        deploy_stage1
        build_push_images
        deploy_stage2
        ;;
    destroy)
        cd "${TERRAFORM_DIR}"
        terraform destroy -auto-approve
        echo -e "${GREEN}All resources have been destroyed.${NC}"
        ;;
    help|*)
        usage
        ;;
esac

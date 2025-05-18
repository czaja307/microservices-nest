// Consolidated outputs file
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "aws_region" {
  description = "The AWS region used for deployment"
  value       = var.aws_region
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = aws_db_instance.postgres.endpoint
}

output "ecr_repositories" {
  description = "URLs of the ECR repositories for each service"
  value       = { for name, repo in aws_ecr_repository.services : name => repo.repository_url }
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "service_urls" {
  description = "URLs for each microservice"
  value = {
    for name, _ in var.services : name => "http://${aws_lb.main.dns_name}/${name}"
  }
}
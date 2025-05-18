// Variables definition
variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for tagging resources"
  type        = string
  default     = "microservices"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "AWS availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "execution_role_arn" {
  description = "ARN of the IAM role for ECS task execution"
  type        = string
}

variable "task_role_arn" {
  description = "ARN of the IAM role for ECS tasks"
  type        = string
}

variable "rabbitmq_url" {
  description = "RabbitMQ connection URL"
  type        = string
  sensitive   = true
}

variable "services" {
  description = "Configuration for microservices"
  type = map(object({
    container_port = number
    host_port      = number
    cpu            = number
    memory         = number
    image          = string
    database_url   = string
  }))
}
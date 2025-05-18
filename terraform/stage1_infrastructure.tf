// Stage 1: Create databases and supporting infrastructure

// RDS Parameter Group
resource "aws_db_parameter_group" "postgres" {
  name   = "${var.project_name}-pg-params"
  family = "postgres13"
}

// RDS Subnet Group
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.public[*].id
  
  # Ensure subnets are created before the DB subnet group
  depends_on = [aws_subnet.public]
  
  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

// Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow database traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// Create one RDS PostgreSQL instance with multiple databases
resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-postgres"
  engine                 = "postgres"
  engine_version         = "13"  // Using major version only, AWS will select latest minor version
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  username               = "postgres"
  password               = "nEaljsOP8iNyKm"
  parameter_group_name   = aws_db_parameter_group.postgres.name
  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true
  skip_final_snapshot    = true
  
  # Add explicit dependency on route table association to ensure the internet gateway is fully set up
  depends_on = [
    aws_route_table_association.public,
    aws_internet_gateway.main
  ]
  
  tags = {
    Name = "${var.project_name}-postgres"
  }
}

// Create ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

// Add ECR repositories for each service
resource "aws_ecr_repository" "services" {
  for_each = var.services
  name     = each.key
  image_scanning_configuration {
    scan_on_push = true
  }
}

// No outputs here, all moved to outputs.tf

// Stage 2: Deploy microservices to ECS

// Create ECS Task Definitions and Services for each microservice
resource "aws_ecs_task_definition" "services" {
  for_each = var.services
  
  family                   = each.key
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = each.value.cpu
  memory                   = each.value.memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name         = each.key
      image        = "${aws_ecr_repository.services[each.key].repository_url}:latest"
      cpu          = each.value.cpu
      memory       = each.value.memory
      essential    = true
      
      portMappings = [
        {
          containerPort = each.value.container_port
          hostPort      = each.value.container_port
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "DATABASE_URL"
          value = each.value.database_url
        },
        {
          name  = "RABBITMQ_URL"
          value = var.rabbitmq_url
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${each.key}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
      }
    }
  ])
}

// Create CloudWatch Log Groups for each service
resource "aws_cloudwatch_log_group" "services" {
  for_each = var.services
  
  name              = "/ecs/${each.key}"
  retention_in_days = 30
}

// Create Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  
  tags = {
    Name = "${var.project_name}-alb"
  }
}

// Create ALB Target Groups for each service
resource "aws_lb_target_group" "services" {
  for_each = var.services
  
  name        = "${substr(each.key, 0, 26)}-tg"
  port        = each.value.container_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-299"
  }
}

// Create ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services["delivery-service"].arn
  }
}

// Create ALB Listener Rules for each service
resource "aws_lb_listener_rule" "services" {
  for_each     = var.services
  listener_arn = aws_lb_listener.http.arn
  priority     = 100 + index(keys(var.services), each.key)
  
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services[each.key].arn
  }
  
  condition {
    path_pattern {
      values = ["/${replace(each.key, "-service", "")}*"]
    }
  }
}

// Modify ECS Services to register with ALB
resource "aws_ecs_service" "services_with_lb" {
  for_each = var.services
  
  name            = each.key
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.services[each.key].arn
  launch_type     = "FARGATE"
  desired_count   = 1
  
  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.services[each.key].arn
    container_name   = each.key
    container_port   = each.value.container_port
  }
  
  depends_on = [aws_lb_listener.http]
}

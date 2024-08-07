data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_ecs_cluster" "ecs_fargate" {
  cluster_name = "${var.project}-${var.environment}-ecs-fargate"
}

data "aws_lb_target_group" "ecs_alb_target_group" {
  name = "ecs-alb-target-group"
}

data "aws_subnets" "private_subnets" {
  tags = {
    Project = var.project
    Tier    = "private"
  }
}

data "aws_security_group" "ecs_fargate_sg" {
  name = "ecs-alb-sg"
}

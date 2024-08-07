resource "aws_lb" "ecs_alb" {
  name               = "${var.project}-${var.environment_short_name}-ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups = [
    aws_security_group.ecs_alb_sg.id,
    aws_security_group.ecs_alb_cloudfront_http.id,
    aws_security_group.ecs_alb_cloudfront_https.id,
    aws_security_group.ecs_alb_r53_healthcheck_prefix.id
  ]
  subnets = data.aws_subnets.public.ids

  enable_deletion_protection = false

  // TODO: Setup access and connection log buckets
}


resource "aws_lb_target_group" "ecs_alb_target_group" {
  name        = "ecs-alb-target-group"
  target_type = "ip"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id

  health_check {
    port     = 80
    protocol = "HTTP"
    path     = "/api/health"
  }
}

resource "aws_lb_listener" "ecs_alb_listener_default" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_alb_target_group.arn
  }
}


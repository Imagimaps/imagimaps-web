module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.7.4"

  cluster_name = "${var.project}-${var.environment}-fargate"

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        base   = 20
        weight = 50
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }
}

resource "aws_security_group" "ecs_alb_sg" {
  name        = "ecs-alb-sg"
  description = "Allow TLS inbound traffic and all outbound traffic"
  vpc_id      = module.vpc.vpc_id

  tags = {
    Name = "ecs-alb-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
  security_group_id = aws_security_group.ecs_alb_sg.id
  cidr_ipv4         = module.vpc.vpc_cidr_block
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.ecs_alb_sg.id
  cidr_ipv4         = module.vpc.vpc_cidr_block
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.ecs_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_security_group" "ecs_alb_cloudfront_http" {
  name        = "ecs-alb-cloudfront-prefix-http"
  description = "Allow inbound traffic from Cloudfront"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  tags = {
    Name = "ecs-alb-cloudfront-prefix-http"
  }
}

resource "aws_security_group" "ecs_alb_cloudfront_https" {
  name        = "ecs-alb-cloudfront-prefix-https"
  description = "Allow inbound traffic from Cloudfront"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  tags = {
    Name = "ecs-alb-cloudfront-prefix-https"
  }
}

resource "aws_security_group" "ecs_alb_r53_healthcheck_prefix" {
  name        = "ecs-alb-r53-healthcheck-prefix"
  description = "Allow inbound traffic from Cloudfront"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 53
    to_port         = 53
    protocol        = "udp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.r53_healthchecks.id]
  }

  tags = {
    Name = "ecs-alb-r53-healthcheck-prefix"
  }
}

resource "aws_lb" "ecs_alb" {
  name               = "imagimaps-${var.environment}-ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups = [
    aws_security_group.ecs_alb_sg.id,
    aws_security_group.ecs_alb_cloudfront_http.id,
    aws_security_group.ecs_alb_cloudfront_https.id,
    aws_security_group.ecs_alb_r53_healthcheck_prefix.id
  ]
  subnets = module.vpc.public_subnets

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

resource "aws_acm_certificate" "ecs_alb_public_cert" {
  domain_name       = "imagimaps.com"
  validation_method = "DNS"
}

data "aws_route53_zone" "imagimaps_com" {
  name         = "imagimaps.com"
  private_zone = false
}

resource "aws_route53_record" "alb_cert_validation_records" {
  for_each = {
    for dvo in aws_acm_certificate.ecs_alb_public_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.imagimaps_com.zone_id
}

resource "aws_acm_certificate_validation" "alb_cert_validation" {
  certificate_arn         = aws_acm_certificate.ecs_alb_public_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.alb_cert_validation_records : record.fqdn]
}

resource "aws_lb_listener" "ecs_alb_listener_https_to_ecs" {
  depends_on = [
    aws_acm_certificate.ecs_alb_public_cert,
    aws_acm_certificate_validation.alb_cert_validation
  ]

  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.alb_cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_alb_target_group.arn
  }
}

resource "aws_security_group" "ecs_alb_sg" {
  name        = "ecs-alb-sg"
  description = "Allow TLS inbound traffic and all outbound traffic"
  vpc_id      = data.aws_vpc.platform.id

  tags = {
    Name = "ecs-alb-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
  security_group_id = aws_security_group.ecs_alb_sg.id
  cidr_ipv4         = data.aws_vpc.platform.cidr_block
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.ecs_alb_sg.id
  cidr_ipv4         = data.aws_vpc.platform.cidr_block
  ip_protocol       = "tcp"
  from_port         = 80
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
  vpc_id      = data.aws_vpc.platform.id

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
  vpc_id      = data.aws_vpc.platform.id

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
  vpc_id      = data.aws_vpc.platform.id

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

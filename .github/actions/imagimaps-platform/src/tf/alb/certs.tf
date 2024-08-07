
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

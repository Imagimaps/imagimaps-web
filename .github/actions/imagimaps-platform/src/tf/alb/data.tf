data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

data "aws_ec2_managed_prefix_list" "r53_healthchecks" {
  name = "com.amazonaws.${var.aws_region}.route53-healthchecks"
}

data "aws_vpc" "platform" {
  tags = {
    Project = "platform"
  }
}

data "aws_subnets" "public" {
  tags = {
    Project = var.project
    Tier    = "public"
  }
}

resource "aws_ec2_tag" "vpc_name" {
  resource_id = data.aws_vpc.platform_vpc.id
  key         = "Name"
  value       = "${var.project}/${var.environment}/vpc"
}

resource "aws_ec2_tag" "vpc_environment" {
  resource_id = data.aws_vpc.platform_vpc.id
  key         = "Environment"
  value       = var.environment
}

resource "aws_ec2_tag" "vpc_project" {
  resource_id = data.aws_vpc.platform_vpc.id
  key         = "Project"
  value       = var.project
}

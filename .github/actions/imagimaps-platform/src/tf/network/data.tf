locals {
  private_subnet_cidr_blocks = "${cidrsubnet(data.aws_vpc.platform_vpc.cidr_block, 8, 0)}"
}

data "aws_vpc" "platform_vpc" {
  filter {
    name   = "cidr-block"
    values = [var.cidr_block]
  }
}

data "aws_subnet_ids" "platform_private_subnets" {
  vpc_id = data.aws_vpc.platform_vpc.id
  filter {
    name   = "cidr-block"
    values = [local.private_subnet_cidr_blocks]
  }
}

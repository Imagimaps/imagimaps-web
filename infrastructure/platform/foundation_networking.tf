module "vpc" {
  # https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest?tab=inputs
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.project}/${var.environment}/vpc"
  cidr = var.vpc_cidr

  azs = ["ap-southeast-2a", "ap-southeast-2b", "ap-southeast-2c"]
  # public_subnets = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
  public_subnets = [
    cidrsubnet(var.vpc_cidr, 8, 0),
    cidrsubnet(var.vpc_cidr, 8, 1),
    cidrsubnet(var.vpc_cidr, 8, 2)
  ]
  public_subnet_tags = {
    "Tier" = "public"
  }

  # private_subnets = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
  private_subnets = [
    cidrsubnet(var.vpc_cidr, 8, 10),
    cidrsubnet(var.vpc_cidr, 8, 11),
    cidrsubnet(var.vpc_cidr, 8, 12)
  ]
  private_subnet_tags = {
    "Tier" = "private"
  }

  enable_vpn_gateway = false
  enable_nat_gateway = true
  single_nat_gateway = true
  create_igw         = true
}

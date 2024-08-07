terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.20.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      OpenTofu    = "true"
      Project     = "imagimaps"
    }
  }
}

terraform {
  backend "s3" {
    key = "imagimaps/infrastructure/iam/service-deploy-role/terraform.tfstate"
  }
}

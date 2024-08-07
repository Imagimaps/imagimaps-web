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
      Terraform   = "true"
      Project     = var.project
    }
  }
}

terraform {
  backend "s3" {
    region         = "ap-southeast-2"
    bucket         = "tofu-remote-state-ap-southeast-2-797628964671"
    key            = "imagimaps/services/terraform.tfstate"
    dynamodb_table = "tofu-remote-state-lock-ap-southeast-2-797628964671"
  }
}

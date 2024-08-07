variable "aws_region" {
  type    = string
  default = "ap-southeast-2"
}

variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

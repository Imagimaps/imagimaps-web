variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
}

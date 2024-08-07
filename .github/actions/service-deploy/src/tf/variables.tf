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

variable "service_name" {
  type    = string
  default = "service"
}

variable "service_port" {
  type    = number
  default = 80
}

variable "service_version" {
  type    = string
  default = "latest"
}

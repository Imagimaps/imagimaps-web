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
  default = "imagimaps-bff"
}

variable "service_port" {
  type    = number
  default = 8080
}

variable "service_version" {
  type    = string
  default = "latest"
}

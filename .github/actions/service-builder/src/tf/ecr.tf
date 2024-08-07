resource "aws_ecr_repository" "service" {
  name                 = "${var.project}/service/${var.service_name}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_repository" "imagimap_services_bff" {
  name                 = "imagimap_services_bff"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

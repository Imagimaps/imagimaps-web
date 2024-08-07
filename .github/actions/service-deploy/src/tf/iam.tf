resource "aws_iam_role" "service_role" {
  name = "ecs_service_role"
  path = "/${var.project}/${var.service_name}/${var.environment}/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "ecs-tasks.amazonaws.com",
            "ecs.amazonaws.com"
          ]
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "service_role_ecr_pull_policy" {
  name = "ecr_pull_policy"
  role = aws_iam_role.service_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/${var.project}/${var.service_name}/${var.environment}",
        ]
      },
      {
        Action = [
          "ecr:GetAuthorizationToken",
        ]
        Effect = "Allow"
        Resource = [
          "*"
        ]
      },
    ]
  })
}

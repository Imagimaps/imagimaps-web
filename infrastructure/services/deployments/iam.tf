resource "aws_iam_role" "imagimaps_ecr_readonly" {
  name = "imagimaps_ecr_readonly"

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

resource "aws_iam_role_policy" "imagimaps_ecr_readonly_policy" {
  name = "imagimaps_ecr_readonly_policy"
  role = aws_iam_role.imagimaps_ecr_readonly.id

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
          "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/*"
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy" "imagimaps_ecr_auth_policy" {
  name = "imagimaps_ecr_auth_policy"
  role = aws_iam_role.imagimaps_ecr_readonly.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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

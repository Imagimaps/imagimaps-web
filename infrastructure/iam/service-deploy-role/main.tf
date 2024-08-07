locals {
  base_statement = [
    {
      "Effect" = "Allow"
      "Principal" = {
        "Service" = "ec2.amazonaws.com"
      }
      "Action" = "sts:AssumeRole"
    }
  ]

  oidc_statement = [
    {
      "Effect" = "Allow"
      "Principal" = {
        "Federated" = data.aws_iam_openid_connect_provider.github_oidc.arn
      }
      "Action" = "sts:AssumeRoleWithWebIdentity"
      "Condition" = {
        "StringEquals" = {
          "${var.oidc_provider_url}:aud" = var.oidc_provider_audience
        }
        "StringLike" = {
          "${var.oidc_provider_url}:sub" = "${var.oidc_provider_namespace}:${var.oidc_provider_account}/*"
        }
      }
    }
  ]

  roles_statement = [
    {
      "Effect" = "Allow"
      "Action" = "sts:AssumeRole"
      "Principal" = {
        "AWS" = "arn:aws:iam::${var.aws_account_id}:root"
      }
      "Condition" = {
        "StringLike" = {
          "aws:PrincipalArn" = [
            "arn:aws:iam::${var.aws_account_id}:role/AWSReservedSSO_AWSPowerUserAccess_*",
            "arn:aws:iam::${var.aws_account_id}:role/AWSReservedSSO_AWSAdministratorAccess_*"
          ]
        }
      }
    }
  ]

  assume_role_policy = {
    "Version" = "2012-10-17"
    "Statement" = concat(local.base_statement, local.oidc_statement, local.roles_statement)
  }
}

resource "aws_iam_role" "service_deploy_role" {
  name               = "service-deploy-role"
  path               = "/imagimaps/automation/"
  description        = "Role for service deployment from a CI/CD pipeline"

  assume_role_policy = jsonencode(local.assume_role_policy)

  inline_policy {}

  managed_policy_arns = [
    data.aws_iam_policy.remote_state_access.arn,
    aws_iam_policy.service_deploy_policy.arn
  ]
}

resource "aws_iam_policy" "service_deploy_policy" {
  name   = "service-deploy-policy"
  path   = "/imagimaps/automation/"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "BroadAccessToRestrictLater",
        "Effect" : "Allow",
        "Action" : [
          "s3:*",
          "ec2:*",
          "autoscaling:*",
          "ecr:*",
          "ecs:*",
          "vpc:*",
          "iam:*",
          "cloudwatch:*",
          "organizations:*",
          "ram:*",
          "route53:*",
          "ssm:*",
          "secretsmanager:*",
          "kms:*",
          "logs:*",
        ],
        "Resource" : "*"
      }
    ]
  })
}

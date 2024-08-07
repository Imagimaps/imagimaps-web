data "aws_iam_policy" "remote_state_access" {
  arn = "arn:aws:iam::${var.aws_account_id}:policy/org/tf/remote-state-access"
}

data "aws_iam_openid_connect_provider" "github_oidc" {
  url = "https://${var.oidc_provider_url}"
}

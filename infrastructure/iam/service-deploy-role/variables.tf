variable "aws_account_id" {
  type    = string
}

variable "aws_region" {
  type    = string
}

variable "oidc_provider_url" {
  type    = string
  default = "token.actions.githubusercontent.com"
}

variable "oidc_provider_audience" {
  type    = string
  default = "sts.amazonaws.com"
}

variable "oidc_provider_namespace" {
    description = "The namespace of the OIDC provider"
    type        = string
    default     = "repo"
}

variable "oidc_provider_account" {
    description = "The account of the OIDC provider"
    type        = string
    default     = ""
}

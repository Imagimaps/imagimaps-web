module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.7.4"

  cluster_name = "${var.project}-${var.environment}-fargate"

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        base   = 20
        weight = 50
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }
}

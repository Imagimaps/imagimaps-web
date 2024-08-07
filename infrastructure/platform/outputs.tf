output "ecs_cluster_id" {
  value = module.ecs.cluster_id
}

output "ecs_cluster_arn" {
  value = module.ecs.cluster_arn
}

output "ecs_alb_target_group_arn" {
  value = aws_lb_target_group.ecs_alb_target_group.arn
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  description = "Policy for Lambda function to access SSM parameters"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParameterHistory",
        ]
        Resource = [
          aws_ssm_parameter.vpc_id.arn,
          aws_ssm_parameter.db_username.arn,
          aws_ssm_parameter.db_password.arn,
          aws_ssm_parameter.db_name.arn,
          aws_ssm_parameter.db_port.arn,
        ]
      }
    ]
  })
}

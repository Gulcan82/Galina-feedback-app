terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.71.0"
    }
  }
  backend "s3" {
    bucket = "terraform-state-feedback-api-506545972720"
    key    = "terraform/feedback-api/terraform.tfstate"
    region = "eu-central-1"
    encrypt = true
  }
}

provider "aws" {
  region = "eu-central-1"
}

# SSM Parameters
resource "aws_ssm_parameter" "vpc_id" {
  name  = "/feedback-app/backend/test/vpc-id"
  type  = "String"
  value = "deine_vpc_id"
}

resource "aws_ssm_parameter" "db_username" {
  name  = "/feedback-app/backend/test/db-user"
  type  = "String"
  value = "dein_db_username"
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/feedback-app/backend/test/db-password"
  type  = "SecureString"
  value = "dein_db_password"
}

resource "aws_ssm_parameter" "db_name" {
  name  = "/feedback-app/backend/test/db-name"
  type  = "String"
  value = "deine_db_name"
}

resource "aws_ssm_parameter" "db_port" {
  name  = "/feedback-app/backend/test/db-port"
  type  = "String"
  value = "5432"
}

resource "aws_ssm_parameter" "rds_endpoint" {
  name  = "/feedback-app/backend/test/rds-endpoint"
  type  = "String"
  value = aws_db_instance.feedback_db.endpoint
}

# IAM Role für die Lambda-Funktion
resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
    ]
  })
}

# Hier die erforderlichen Berechtigungen hinzufügen
resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  description = "Policy für die Lambda-Funktion"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "logs:*", # Anpassen, je nach Bedarf
          "rds:DescribeDBInstances" # Berechtigung für die RDS-Instanz hinzufügen
        ]
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_policy_attachment" {
  name       = "lambda_policy_attachment"
  roles      = [aws_iam_role.lambda_execution_role.name]
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Lambda Function
resource "aws_lambda_function" "hello_world" {
  function_name = "hello_world"
  handler       = "hello_world.handler"
  runtime       = "nodejs14.x"

  role = aws_iam_role.lambda_execution_role.arn

  filename         = "path/to/your/hello_world.zip"
  source_code_hash = filebase64sha256("path/to/your/hello_world.zip")

  environment = {
    DB_HOST     = aws_ssm_parameter.rds_endpoint.value
    DB_USERNAME = aws_ssm_parameter.db_username.value
    DB_PASSWORD = aws_ssm_parameter.db_password.value
    DB_NAME     = aws_ssm_parameter.db_name.value
    DB_PORT     = aws_ssm_parameter.db_port.value
  }
}

# RDS Instance
resource "aws_security_group" "rds_postgres_sg" {
  name        = "rds-postgres-sg"
  description = "Allow all inbound traffic to postgres db."
  vpc_id      = aws_ssm_parameter.vpc_id.value

  ingress {
    from_port   = tonumber(aws_ssm_parameter.db_port.value)
    to_port     = tonumber(aws_ssm_parameter.db_port.value)
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_subnets" "selected_subnets" {
  filter {
    name   = "vpc-id"
    values = [aws_ssm_parameter.vpc_id.value]
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = data.aws_subnets.selected_subnets.ids
}

resource "aws_db_instance" "feedback_db" {
  identifier              = "feedback-api-db"
  engine                  = "postgres"
  engine_version          = "16.3"
  instance_class          = "db.t3.micro"
  storage_type            = "gp3"
  allocated_storage        = 20
  username                = aws_ssm_parameter.db_username.value
  password                = aws_ssm_parameter.db_password.value
  db_name                 = aws_ssm_parameter.db_name.value
  port                    = tonumber(aws_ssm_parameter.db_port.value) # Konvertiere den Port in eine Zahl
  parameter_group_name    = "default.postgres16"
  publicly_accessible     = true
  vpc_security_group_ids   = [aws_security_group.rds_postgres_sg.id]
  db_subnet_group_name     = aws_db_subnet_group.rds_subnet_group.name
  skip_final_snapshot      = true
}

output "rds_endpoint" {
  description = "The endpoint of the RDS Postgres database."
  value       = aws_db_instance.feedback_db.endpoint
}

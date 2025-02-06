#!/bin/bash

# Set AWS profile for LocalStack
aws configure set aws_access_key_id test --profile localstack
aws configure set aws_secret_access_key test --profile localstack
aws configure set region us-east-1 --profile localstack

# Export AWS_PROFILE
export AWS_PROFILE=localstack

# Debug Output
echo "AWS_PROFILE has been set to: $AWS_PROFILE"

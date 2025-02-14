#!/bin/bash
 
# Set AWS profile for LocalStack
aws configure set aws_access_key_id test --profile localstack
aws configure set aws_secret_access_key test --profile localstack
aws configure set region us-east-1 --profile localstack
 
# SET env
export AWS_PROFILE=localstack
export CDK_DEPLOY_ACCOUNT=000000000000
export CDK_DEPLOY_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
 
# Debug Output
echo "AWS_PROFILE has been set to: $AWS_PROFILE"
echo "CDK_DEPLOY_ACCOUNT has been set to: $CDK_DEPLOY_ACCOUNT"
echo "CDK_DEPLOY_REGION has been set to: $CDK_DEPLOY_REGION"
echo "AWS_ENDPOINT_URL has been set to: $AWS_ENDPOINT_URL"
# AWS CDK TypeScript project

This is a sample project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
- `npx cdk deploy` to deploy the infrastructure to AWS.
- `npx cdk destroy` to tear down deployed infrastructure.

## Project Structure and Execution Guide

### Overview

This guide provides a detailed explanation of the structure and execution flow of an AWS CDK project. It explains the purpose of key files and their roles in deploying infrastructure using the AWS CDK.

### Project Structure

#### 1. `cdk.json`

This file is the entry point for the AWS CDK CLI. It tells the CDK how to run your app.

- **Purpose**:

  - Specifies the command to execute your CDK app.
  - Sets configuration options for the CDK CLI.

- **Example**:

  ```json
  {
    "app": "npx ts-node bin/my-app.ts",
    "context": {
      "key": "value"
    }
  }
  ```

#### 2. `bin/<app-name>.ts`

This file is the main entry point for your CDK app. It initializes the CDK application and defines which stacks to deploy.

- **Responsibilities**:

  - Create a new CDK application (`App`).
  - Instantiate stacks and pass required parameters to them.

- **Example**:

  ```typescript
  // bin/my-app.ts
  import * as cdk from "aws-cdk-lib";
  import { MyStack } from "../lib/my-stack";

  const app = new cdk.App();
  new MyStack(app, "MyStack", {
    /* Optional Stack properties */
  });
  app.synth();
  ```

#### 3. `lib\<app-name>-stack.ts`

This file defines the resources for a specific stack. It is where you declare your infrastructure using CDK constructs.

- **Responsibilities**:

  - Define AWS resources such as Lambda functions, API Gateways, S3 buckets, etc.
  - Use CDK constructs (`aws-cdk-lib`) to model infrastructure as code.

- **Example**:

  ```typescript
  // lib/my-stack.ts
  import * as cdk from "aws-cdk-lib";
  import { Construct } from "constructs";
  import * as lambda from "aws-cdk-lib/aws-lambda";

  export class MyStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // Define a Lambda function
      new lambda.Function(this, "MyLambda", {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "index.handler",
      });
    }
  }
  ```

#### 4. `package.json`

This file manages dependencies for your CDK project and specifies scripts to build, test, or deploy your project.

- **Responsibilities**:

  - Manage dependencies (e.g., `aws-cdk-lib`, `constructs`).
  - Provide commands for running your app (`npm run build`, `npm run deploy`).

- **Example**:

  ```json
  {
    "name": "my-cdk-app",
    "version": "1.0.0",
    "scripts": {
      "build": "tsc",
      "deploy": "cdk deploy",
      "destroy": "cdk destroy"
    },
    "dependencies": {
      "aws-cdk-lib": "^2.90.0",
      "constructs": "^10.0.0"
    },
    "devDependencies": {
      "ts-node": "^10.9.1",
      "typescript": "^5.1.6"
    }
  }
  ```

### Execution Flow of the CDK Project

1. **Run the CDK CLI**: When you run `cdk synth` or `cdk deploy`, the CLI executes the command specified in `cdk.json`.

2. **Entry Point (**`bin\<app-name>.ts`**)**:

   - The entry point creates an instance of `cdk.App()`.
   - It initializes one or more stacks by calling their constructors.

3. **Stack Definition (**`lib\<app-name>-stack.ts`**)**:

   - Each stack file defines the resources and their relationships.
   - Constructs like Lambda, S3, and DynamoDB are added to the stack.

4. **Synthesis**:

   - The CDK app synthesizes all stacks into CloudFormation templates.

5. **Deployment**:

   - The CDK CLI deploys the generated CloudFormation templates to AWS.

### Key Files Summary

| **File**                  | **Purpose**                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `cdk.json`                | Entry point for the CDK CLI; defines the command to run your app.            |
| `bin/<app-name>.ts`       | Main entry point for the app; initializes stacks.                            |
| `lib\<app-name>-stack.ts` | Contains resource definitions for a specific stack.                          |
| `package.json`            | Manages dependencies and defines helpful scripts for building and deploying. |

## Local Development/Testing Setup

### What is LocalStack?

[LocalStack](https://localstack.cloud/) is a fully functional local AWS cloud stack that emulates a variety of AWS services (e.g., S3, Lambda, DynamoDB) for local development and testing. It allows you to run and test your AWS-related code locally, saving time and reducing costs compared to using AWS services directly. LocalStack provides a local testing environment that closely mimics the behavior of AWS, helping you build and test cloud applications without needing an active AWS account or spending on cloud resources.

For more details, visit the official LocalStack documentation:  
[LocalStack Docs](https://docs.localstack.cloud/)

### 1. Set Up AWS Local Profile

Before running any commands, make sure to set up your AWS profile for LocalStack. Run the following command:

```bash
source ./setup-aws-local-profile.sh
```

This will configure your local AWS profile to work with LocalStack, ensuring that all AWS SDKs and the AWS CLI point to your local environment, using the `localstack` profile instead of your default AWS profile.

### 2. Start LocalStack

To start LocalStack, which emulates AWS services locally using Docker, run:

```bash
npm run init:localstack
```

This command starts all the necessary LocalStack services in the background using [Docker Compose](./docker-compose.yml). LocalStack will be accessible at `http://localhost:4566`, where all AWS service requests will be redirected to the local emulation instead of actual AWS.

> **Note on LocalStack URL**:  
> LocalStack runs on `http://localhost:4566` by default. Any AWS SDK or AWS CLI calls you make will be sent to this URL unless otherwise configured. For example, if you use the AWS CLI with the `--endpoint-url` flag, you would point it to `http://localhost:4566` to interact with your local AWS services.

#### Check LocalStack Health

To verify if LocalStack has initialized successfully, you can check its health status by running the following command:

```bash
curl http://localhost:4566/_localstack/health
```

If everything is set up correctly, this will return a JSON response indicating that all services are up and running.

### 3. Start the Application

Once LocalStack is running, you can start your application and deploy resources to the local environment by running:

```bash
npm run start
```

This command does the following:

- **Builds** the application using `npm run build`.
- **Bootstraps** the local AWS environment (`npm run local:bootstrap`), which prepares the environment for deployment.
- **Synthesizes** the CloudFormation template (`npm run local:synth`), converting your CDK stack into a CloudFormation template.
- **Deploys** the stack to LocalStack (`npm run local:deploy`), making your resources available in the local AWS environment.

> **Note:** If any changes are made to the Lambda handlers or other application code, you'll need to rebuild and redeploy the application by running `npm run build` and `npm run local:deploy` again to reflect the changes.

### 4. Destroy LocalStack

Once you're done with your local development, you can stop and clean up the LocalStack services by running:

```bash
npm run destroy:localstack
```

This command stops all containers that were created by Docker Compose during LocalStack's startup.

---

### Explanation of Commands in `package.json`

- **`npm run init:localstack`**: Starts LocalStack in detached mode using Docker Compose.
- **`npm run start`**: Builds, bootstraps, synthesizes, and deploys the application to LocalStack.
- **`npm run destroy:localstack`**: Stops LocalStack.

---

### Additional Notes:

- **Lambda Code Changes**: Whenever you modify Lambda handler code or other application logic, remember to run `npm run build` to rebuild the project and `npm run local:deploy` to deploy the updated code to LocalStack.

- **Clean Up**: If you want to clean up the build artifacts and CloudFormation outputs, run `npm run clean`.

- **Verify aws services is running from localstack**: example: list tables from dynamodb
  ```
  aws dynamodb list-tables --profile localstack --endpoint-url=http://localhost:4566
  ```

# AWS CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

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

### Notes

- Use `cdk synth` to generate the CloudFormation templates locally.
- Use `cdk deploy` to deploy the infrastructure to AWS.
- Use `cdk destroy` to tear down deployed infrastructure.

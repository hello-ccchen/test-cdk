# AWS CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `cdk synth` emits the synthesized CloudFormation template
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk destroy` to tear down deployed infrastructure.
- `cdk diff` compare deployed stack with current state

### AWS CLI

- delete dynamo table
  ```
  aws --endpoint-url=http://localhost:4566 dynamodb delete-table --table-name YourTableName
  ```
- list dynamo table
  ```
  aws --endpoint-url=http://localhost:4566 dynamodb list-tables
  ```

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

## Testing Locally with SAM

### Official Document:

https://docs.aws.amazon.com/cdk/v2/guide/testing-locally-getting-started.html

### Prepare the Environment

#### 1. Ensure esbuild.config.js is Setup

If your project uses esbuild for bundling, make sure your esbuild.config.js file is properly configured to bundle your Lambda functions. This config is essential for building the Lambda functions correctly before deploying or testing locally.

For example, your esbuild.config.js might look like this:

```js
module.exports = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node14",
  outdir: "./dist",
};
```

Ensure that the output directory (./dist) contains the bundled Lambda functions required by your application.

#### 2. Run cdk synth

Before testing your Lambda locally with SAM, you need to synthesize the CDK stack to generate the CloudFormation template. This ensures that your Lambda functions and infrastructure are correctly defined.

Run the following command to generate the template:

```bash
cdk synth
```

#### 3. Setup DynamoDB Locally (if using)

To test DynamoDB locally when using AWS SAM (Serverless Application Model), you can use **DynamoDB Local**. DynamoDB Local is a small, client-side version of DynamoDB that you can run on your local machine. Here's how you can set it up for local testing with SAM.

##### 1. Start DynamoDB Local

You can easily run DynamoDB Local using **Docker**. To start DynamoDB Local, run the following command:

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local
```

This will run DynamoDB Local on `http://localhost:8000`.

##### 2. Set Environment Variables

Next, you need to configure your local environment to point to DynamoDB Local instead of the actual DynamoDB service in AWS. Set the following environment variables:

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:8000
```

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set to arbitrary values (`test` in this case), as DynamoDB Local doesn't require real AWS credentials.
- `AWS_ENDPOINT_URL` is the key setting here, which points to DynamoDB Local running on `localhost:8000`.

##### 3. Configure SAM to Use DynamoDB Local

When you run **SAM** locally, it will now use DynamoDB Local instead of the AWS cloud DynamoDB. You can test your Lambda functions locally by setting the correct endpoint.

- Ensure the `AWS_ENDPOINT_URL` is pointing to DynamoDB Local (as shown above).
- When your Lambda function accesses DynamoDB, it will use DynamoDB Local instead of AWS cloud DynamoDB.

##### 4. Example DynamoDB Table Local Setup

You can use the AWS CLI or AWS SDK to create tables in DynamoDB Local. Here's an example of creating a simple table:

```bash
aws --endpoint-url=http://localhost:8000 dynamodb create-table \
    --table-name TodoTable \
    --attribute-definitions \
        AttributeName=Id,AttributeType=S \
    --key-schema \
        AttributeName=Id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

This command creates a table named `MyTable` in DynamoDB Local with a simple `Id` key.

Verify if the table created

```bash
aws --endpoint-url=http://localhost:8000 dynamodb list-tables
```

##### 5. Stop DynamoDB Local

When you're done with testing, you can stop DynamoDB Local by stopping the Docker container:

```bash
docker stop $(docker ps -q --filter "ancestor=amazon/dynamodb-local")
```

This will stop the DynamoDB Local container.

##### 6. Cleanup Environment Variables

After you're done testing with DynamoDB Local, you can **unset** the environment variables to avoid any issues with future AWS CLI or SAM usage:

```bash
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_DEFAULT_REGION
unset AWS_ENDPOINT_URL
```

Unsetting these variables ensures that any future AWS CLI or SDK calls will use your default AWS credentials instead of pointing to the local DynamoDB instance.

### Invoke Locally

Now you can invoke your Lambda API locally using SAM CLI and specify a custom CloudFormation template generated by CDK. This is useful when you want to test the infrastructure setup defined in your CDK stack.

To run the Lambda API locally using your CDK generated template, use the following command:

```bash
sam local start-api -t ./cdk.out/TestCdkStack.template.json
```

This command will:

Use the generated CloudFormation template (TestCdkStack.template.json) located in the ./cdk.out directory.
Start the local API gateway and Lambda functions defined in your template.

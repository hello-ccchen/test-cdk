import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Construct } from "constructs";

export class TestCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, "TodoTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const getTodosLambda = new lambda.Function(this, "ListTodosHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "list-todos-handler.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist")),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const createTodoLambda = new lambda.Function(this, "AddTodoHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "add-todo-handler.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist")),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(getTodosLambda);
    table.grantReadWriteData(createTodoLambda);

    const api = new apigateway.RestApi(this, "TodoApi", {
      restApiName: "Todo Service",
    });

    const todosResource = api.root.addResource("todos");
    todosResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getTodosLambda)
    );
    todosResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createTodoLambda)
    );
  }
}

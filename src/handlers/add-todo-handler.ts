import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any): Promise<ApiResponse> => {
  // Parse the body from the event (assumed to be a JSON string)
  const body: Todo = JSON.parse(event.body || "{}");

  // Validate that the body has the necessary fields
  if (!body.id || !body.description || typeof body.isCompleted !== "boolean") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing id, task, or isCompleted field in the request body",
      }),
    };
  }

  // Prepare the parameters for the DynamoDB put operation
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: { S: body.id }, // For strings, use the { S: value } format
      task: { S: body.description },
      isCompleted: { BOOL: body.isCompleted }, // Use { BOOL: value } for booleans
    },
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDbClient.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Task created" }),
    };
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("An unknown error occurred");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

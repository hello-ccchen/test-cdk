import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any): Promise<ApiResponse> => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const command = new ScanCommand(params);
    const { Items } = await dynamoDbClient.send(command); // Sending the scan command
    // Unmarshall DynamoDB items into JavaScript objects
    const formattedItems = Items?.map((item) => unmarshall(item));
    return {
      statusCode: 200,
      body: JSON.stringify(formattedItems),
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

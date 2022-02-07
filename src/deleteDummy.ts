import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function deleteDummy(id: string): Promise<string> {
    const params = {
        TableName: process.env.tableName as string,
        Key: { id }
    }

    await dynamoDb.delete(params).promise()

    return id
}
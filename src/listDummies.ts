import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function listDummies(): Promise<Record<string, unknown>[] | undefined> {
    const params = {
        TableName: process.env.tableName as string
    }

    const data = await dynamoDb.scan(params).promise()

    return data.Items
}
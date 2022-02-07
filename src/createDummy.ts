import { DynamoDB } from 'aws-sdk'
import Dummy from './Dummy'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function createDummy(dummy: Dummy): Promise<Dummy> {
    const params = {
        Item: dummy as Record<string, unknown>,
        TableName: process.env.tableName as string
    }

    await dynamoDb.put(params).promise()

    return dummy
}
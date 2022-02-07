import { DynamoDB } from 'aws-sdk'
import Dummy from './Dummy'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function updateDummy(dummy: Dummy): Promise<Dummy> {
    const params = {
        TableName: process.env.tableName as string,
        Key: { id: dummy.id },
        ReturnValues: 'UPDATED_NEW',
        UpdateExpression: 'SET test = :test',
        ExpressionAttributeValues: { ':test': dummy.test }
    }

    await dynamoDb.update(params).promise()

    return dummy as Dummy
}
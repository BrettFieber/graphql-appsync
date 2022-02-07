import { DynamoDB } from 'aws-sdk'
import Dummy from './Dummy'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function getDummyById(id: string): Promise<Dummy | undefined> {
    const params = {
        TableName: process.env.tableName as string,
        Key: { id }
    }

    const { Item } = await dynamoDb.get(params).promise()

    return Item as Dummy
}
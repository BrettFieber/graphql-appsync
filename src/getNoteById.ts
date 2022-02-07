import { DynamoDB } from 'aws-sdk'
import Note from './Note'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function getNoteById(noteId: string): Promise<Note | undefined> {
    const params = {
        TableName: process.env.tableName as string,
        Key: { id: noteId }
    }

    const { Item } = await dynamoDb.get(params).promise()

    return Item as Note
}
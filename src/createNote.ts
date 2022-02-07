import { DynamoDB } from 'aws-sdk'
import Note from './Note'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function createNote(note: Note): Promise<Note> {
    const params = {
        Item: note as Record<string, unknown>,
        TableName: process.env.tableName as string
    }

    await dynamoDb.put(params).promise()

    return note
}
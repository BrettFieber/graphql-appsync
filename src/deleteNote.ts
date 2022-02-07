import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function deleteNote(noteId: string): Promise<string> {
    const params = {
        TableName: process.env.tableName as string,
        Key: { id: noteId }
    }

    await dynamoDb.delete(params).promise()

    return noteId
}
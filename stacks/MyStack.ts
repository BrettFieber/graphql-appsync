import * as sst from "@serverless-stack/resources";
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { MappingTemplate } from '@aws-cdk/aws-appsync'

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // test importing an existing table
    const existingTable = new sst.Table(this, 'Dummy', {
      dynamodbTable: dynamodb.Table.fromTableArn(this, 'DummyTable', 'arn:aws:dynamodb:us-west-2:000681055310:table/existing-table-test')
    })

    // Create a notes table
    const notesTable = new sst.Table(this, 'Notes', {
      fields: {
        id: sst.TableFieldType.STRING
      },
      primaryIndex: { partitionKey: 'id' }
    })

    // Wubba Table
    // const wubbaTable = new sst.Table(this, 'Wubba', {
    //   fields: {
    //     id: sst.TableFieldType.STRING,
    //     email: sst.TableFieldType.STRING,
    //     json: sst.TableFieldType.STRING,
    //     date: sst.TableFieldType.STRING,
    //     time: sst.TableFieldType.STRING,
    //     datetime: sst.TableFieldType.STRING,
    //     timestamp: sst.TableFieldType.NUMBER,
    //     url: sst.TableFieldType.STRING,
    //     phoneno: sst.TableFieldType.STRING,
    //     ip: sst.TableFieldType.STRING
    //   }
    // })

    // Create the AppSync GraphQL API
    const api = new sst.AppSyncApi(this, 'AppSyncApi', {
      graphqlApi: {
        schema: [
          'graphql/note-schema.graphql',
          'graphql/dummy-schema.graphql',
          'graphql/derp-schema.graphql',
          // 'graphql/wubba-schema.graphql'
        ]
      },
      // * moved table env vars into per-DS config
      // defaultFunctionProps: { // Global props applied to all dataSources/resolvers
      //   // Pass the table name to the function
      //   environment: {
      //     NOTES_TABLE: notesTable.dynamodbTable.tableName,
      //     DUMMY_TABLE: existingTable.tableName
      //   }
      // },
      dataSources: {
        notesDS: {
          handler: 'src/notesDS.handler',
          environment: { tableName: notesTable.dynamodbTable.tableName }
        },
        dummiesDS: {
          handler: 'src/dummiesDS.handler',
          environment: { tableName: existingTable.tableName }
        },
        durpDS: {
          table: existingTable
        },
        // wubbaDS: {
        //   table: wubbaTable
        // }
      },
      resolvers: {
        'Query    listNotes': 'notesDS',
        'Query    getNoteById': 'notesDS',
        'Mutation createNote': 'notesDS',
        'Mutation updateNote': 'notesDS',
        'Mutation deleteNote': 'notesDS',

        'Query    listDummies': 'dummiesDS',
        'Query    getDummyById': 'dummiesDS',
        'Mutation createDummy': 'dummiesDS',
        'Mutation updateDummy': 'dummiesDS',
        'Mutation deleteDummy': 'dummiesDS',

        'Query    listDurps': { 
          dataSource: 'durpDS',
          resolverProps: {
            requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
            responseMappingTemplate: MappingTemplate.dynamoDbResultList()
          }
        },
        // 'Query    listWubbas': { 
        //   dataSource: 'wubbaDS',
        //   resolverProps: {
        //     requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
        //     responseMappingTemplate: MappingTemplate.dynamoDbResultList()
        //   }
        // },
        // 'Query    getWubba': { 
        //   dataSource: 'wubbaDS',
        //   resolverProps: {
        //     requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', ''),
        //     responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
        //   }
        // }
      }
    })

    // Enable the AppSync API to access the DynamoDB table
    api.attachPermissions([notesTable])
    api.attachPermissions([existingTable])

    // Show the AppSync API Id in the output
    this.addOutputs({
      ApiId: api.graphqlApi.apiId
    });
  }
}

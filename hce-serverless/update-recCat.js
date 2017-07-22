import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'HCE-RecipeCategories',
        Key: {
            userId: event.requestContext.authorizer.claims.sub,
            id: event.pathParameters.id,
        },
        ConditionExpression: 'attribute_exists(userId) and attribute_exists(id)',
        UpdateExpression: 'SET #cat = :cat, #mod = :mod',
        ExpressionAttributeNames: {
            '#cat': 'category',
            '#mod': 'modifiedAt',
        },
        ExpressionAttributeValues: {
            ':cat': data.category,
            ':mod': new Date().getTime(),
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamoDbLib.call('update', params);
        console.log(result);
        callback(null, success({status: true}));
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
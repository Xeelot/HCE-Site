import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, invalid, failure} from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const queryParams = {
        TableName: 'HCE-RecipeCategories',
        IndexName: 'userId-category-index',
        KeyConditionExpression: "#uid = :uid and #cat = :cat",
        ExpressionAttributeNames: {
            "#uid": "userId",
            "#cat": "category",
        },
        ExpressionAttributeValues: {
            ":uid": event.requestContext.identity.cognitoIdentityId,
            ":cat": data.category,
        },
    };
    const useId = ('testId' in data) ? data.testId : uuid.v1();
    const putParams = {
        TableName: 'HCE-RecipeCategories',
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            id: useId,
            category: data.category,
            createdAt: new Date().getTime(),
            modifiedAt: new Date().getTime(),
        },
    };

    try {
        const queryResult = await dynamoDbLib.call('query', queryParams);
        if (queryResult.Items && queryResult.Count > 0) {
            callback(null, invalid({status: false, error: 'Recipe Category: ' + data.category + ' already exists!'}));
        } else {
            const putResult = await dynamoDbLib.call('put', putParams);
            callback(null, success(putParams.Item));
        }
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
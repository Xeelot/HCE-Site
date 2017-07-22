import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, invalid, failure} from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const queryParams = {
        TableName: 'HCE-Recipes',
        IndexName: 'userId-title-index',
        KeyConditionExpression: "#uid = :uid and #tit = :tit",
        ExpressionAttributeNames: {
            "#uid": "userId",
            "#tit": "title",
        },
        ExpressionAttributeValues: {
            ":uid": event.requestContext.authorizer.claims.sub,
            ":tit": data.title,
        },
    };
    const putParams = {
        TableName: 'HCE-Recipes',
        Item: {
            userId: event.requestContext.authorizer.claims.sub,
            id: uuid.v1(),
            category: data.category,
            createdAt: new Date().getTime(),
            modifiedAt: new Date().getTime(),
            title: data.title,
            notes: data.notes,
            servings: data.servings,
            ingredients: data.ingredients,
        },
    };

    try {
        const queryResult = await dynamoDbLib.call('query', queryParams);
        if (queryResult.Items && queryResult.Count > 0) {
            callback(null, invalid({status: false, error: 'Recipe: ' + data.category + ' already exists!'}));
        } else {
            const putResult = await dynamoDbLib.call('put', putParams);
            callback(null, success(putParams.Item));
        }
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
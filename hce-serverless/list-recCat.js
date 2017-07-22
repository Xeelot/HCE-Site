import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, notFound, failure} from './libs/response-lib';

export async function main(event, context, callback) {
    const params = {
        TableName: 'HCE-RecipeCategories',
        KeyConditionExpression: "#uid = :uid",
        IndexName: "userId-category-index",
        ExpressionAttributeNames: {
            "#uid": "userId",
        },
        ExpressionAttributeValues: {
            ":uid": event.requestContext.authorizer.claims.sub,
        }
    };

    try {
        const result = await dynamoDbLib.call('query', params);
        if (result.Items && result.Count > 0) {
            callback(null, success(result.Items));
        } else {
            callback(null, notFound({status: false, error: 'Item not found.'}))
        }
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
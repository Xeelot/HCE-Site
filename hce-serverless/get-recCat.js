import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, notFound, failure} from './libs/response-lib';

export async function main(event, context, callback) {
    const params = {
        TableName: 'HCE-RecipeCategories',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            id: event.pathParameters.id,
        },
    };

    try {
        const result = await dynamoDbLib.call('get', params);
        if (result.Item) {
            callback(null, success(result.Item));
        } else {
            callback(null, notFound({status: false, error: 'Item not found.'}));
        }
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
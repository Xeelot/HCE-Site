import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, invalid, failure} from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const queryParams = {
        TableName: 'HCE-Ingredients',
        IndexName: 'userId-title-index',
        KeyConditionExpression: "#uid = :uid and #tit = :tit",
        ExpressionAttributeNames: {
            "#uid": "userId",
            "#tit": "title",
        },
        ExpressionAttributeValues: {
            ":uid": event.requestContext.identity.cognitoIdentityId,
            ":tit": data.title,
        },
    };
    const useId = ('testId' in data) ? data.testId : uuid.v1();
    const putParams = {
        TableName: 'HCE-Ingredients',
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            id: useId,
            category: data.category,
            createdAt: new Date().getTime(),
            modifiedAt: new Date().getTime(),
            title: data.title,
            notes: data.notes,
            servingSize: data.servingSize,
            calories: data.calories,
            totalFat: data.totalFat,
            saturatedFat: data.saturatedFat,
            transFat: data.transFat,
            cholesterol: data.cholesterol,
            sodium: data.sodium,
            carbohydrate: data.carbohydrate,
            fiber: data.fiber,
            sugar: data.sugar,
            protein: data.protein,
        },
    };

    try {
        const queryResult = await dynamoDbLib.call('query', queryParams);
        if (queryResult.Items && queryResult.Count > 0) {
            callback(null, invalid({status: false, error: 'Ingredient: ' + data.title + ' already exists!'}));
        } else {
            const putResult = await dynamoDbLib.call('put', putParams);
            callback(null, success(putParams.Item));
        }
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}

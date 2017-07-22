import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'HCE-Ingredients',
        Key: {
            userId: event.requestContext.authorizer.claims.sub,
            id: event.pathParameters.id,
        },
        ConditionExpression: 'attribute_exists(userId) and attribute_exists(id)',
        UpdateExpression: 'SET #cat = :cat, #mod = :mod, #tit = :tit, #not = :not, ' +
            '#ser = :ser, #cal = :cal, #tof = :tof, #saf = :saf, #trf = :trf, #cho = :cho, ' +
            '#sod = :sod, #car = :car, #fib = :fib, #sug = :sug, #pro = :pro',
        ExpressionAttributeNames: {
            '#cat': 'category',
            '#mod': 'modifiedAt',
            '#tit': 'title',
            '#not': 'notes',
            '#ser': 'servingSize',
            '#cal': 'calories',
            '#tof': 'totalFat',
            '#saf': 'saturatedFat',
            '#trf': 'transFat',
            '#cho': 'cholesterol',
            '#sod': 'sodium',
            '#car': 'carbohydrate',
            '#fib': 'fiber',
            '#sug': 'sugar',
            '#pro': 'protein',
        },
        ExpressionAttributeValues: {
            ':cat': data.category,
            ':mod': new Date().getTime(),
            ':tit': data.title,
            ':not': data.notes,
            ':ser': data.servingSize,
            ':cal': data.calories,
            ':tof': data.totalFat,
            ':saf': data.saturatedFat,
            ':trf': data.transFat,
            ':cho': data.cholesterol,
            ':sod': data.sodium,
            ':car': data.carbohydrate,
            ':fib': data.fiber,
            ':sug': data.sugar,
            ':pro': data.protein,
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamoDbLib.call('update', params);
        callback(null, success({status: true}));
    } catch(e) {
        console.log(e);
        callback(null, failure({status: false, error: 'Unexpected error'}));
    }
}
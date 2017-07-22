export default {
    apiGateway: {
        URL: 'https://a74kfh2mol.execute-api.us-west-2.amazonaws.com/prod',
    },
    cognito: {
        REGION : 'us-west-2',
        USER_POOL_ID : 'us-west-2_et4M44h13',
        APP_CLIENT_ID : '55jo5a8ertr0ro7dunbqod909',
        IDENTITY_POOL_ID : 'us-west-2:71d00447-5597-4f24-b176-69615ab63ead',
    },
    s3: {
        BUCKET : 'hce-bucket',
    },
    routes: {
        HOME : '/',
        LOGIN : '/login',
        SIGNUP : '/signup',
        INGREDIENTS : '/ingredients',
        RECIPES : '/recipes',
        NEW_INGREDIENT : '/ingredient/new',
        NEW_RECIPE : '/recipe/new',
    },
    MAX_ATTACHMENT_SIZE: 5000000,
};
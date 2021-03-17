const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { FirehoseClient, PutRecordCommand } = require("@aws-sdk/client-firehose");

// Set the AWS region
const REGION = "us-east-1"; // e.g., "us-east-1"
const IDENTITY_POOL = ""

const s3 = new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL // IDENTITY_POOL_ID
    })
});

(async () => {
    // Create S3 bucket
    try {
        const results = await s3.send(new PutObjectCommand({ Bucket: "", Key: Date.now().toString(), Body: "Hello World!" }));
        console.log("Successfully uploaded data to S3.");
    } catch (err) {
        console.log("Error", err);
    }
})();

const firehose = new FirehoseClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL // IDENTITY_POOL_ID
    })
});

(async () => {
    try {
        let putRecordCommandInput = {
            "Record": {
                "Data": Buffer.from(JSON.stringify({
                    time: Date.now()
                }), "base64")
            },
            "DeliveryStreamName": ""
        }

        console.log(putRecordCommandInput);

        const data = await firehose.send(new PutRecordCommand(putRecordCommandInput));

        console.log("Successfully uploaded data to Firehose.");
    } catch (err) {

        console.log("Error", err);
        //console.log(err.$metadata);
    }
})();
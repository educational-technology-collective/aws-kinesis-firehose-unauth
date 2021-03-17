import boto3
from botocore.exceptions import ClientError

try:
    # Get access token
    client = boto3.client('cognito-identity', region_name="us-east-1")
    resp =  client.get_id(IdentityPoolId='us-east-1:xxxxxx-xxxx-xxxx-xxxx-xxxxxxx')

    
    resp = client.get_credentials_for_identity(IdentityId=resp['IdentityId'])
    secretKey = resp['Credentials']['SecretKey']
    accessKey = resp['Credentials']['AccessKeyId']
    sessionToken = resp['Credentials']['SessionToken']

    
    firehose = boto3.client('firehose', 
                          region_name='us-east-1',
                          aws_access_key_id=accessKey,
                          aws_secret_access_key=secretKey,
                          aws_session_token=sessionToken
                          )
    response = firehose.put_record(
    DeliveryStreamName='clickstream2bucket',
    Record={
        'Data': 'yep'
    }
)


except (ClientError, KeyError):
    print("No Unauth")
    exit(0)
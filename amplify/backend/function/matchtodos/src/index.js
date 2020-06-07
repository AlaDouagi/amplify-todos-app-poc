// API_AMPLIFYTODOSAPPPOCAPI_GRAPHQLAPIIDOUTPUT
// API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_ARN
// API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME
// ENV
// REGION

const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// check https://www.gravitywell.co.uk/insights/how-to-use-your-mocked-dynamodb-with-appsync-and-lambda/
// Mock Mode
const isFake = process.env.ENV === 'NONE';

const region = isFake ? 'us-fake-1' : process.env.REGION;

const awsConfig = {
  region,
};

if (isFake) {
  awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  awsConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

exports.handler = function (event, context, callback) {
  const params = {
    TableName: process.env.API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME,
    FilterExpression: 'title = :title',
    ExpressionAttributeValues: {
      ':title': event.arguments.title,
    },
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data.Items);
    }
  });
};

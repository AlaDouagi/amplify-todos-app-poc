/* Amplify Params - DO NOT EDIT
	API_AMPLIFYTODOSAPPPOCAPI_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_ARN
	API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

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
  const ownerTodosparams = {
    TableName: process.env.API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME,
    FilterExpression: '#owner_id = :owner',
    ExpressionAttributeValues: {
      ':owner': event.arguments.owner,
    },
    ExpressionAttributeNames: {
      '#owner_id': 'owner',
    },
  };

  docClient.scan(ownerTodosparams, function (err, data) {
    if (err) {
      callback(err);
    } else {
      const titleValues = data.Items.map(({ title }) => title);
      const titleObject = {};

      titleValues.forEach(function (value, index) {
        const titleKey = ':titlevalue' + index;
        titleObject[titleKey.toString()] = value;
      });

      const matchedTodosParams = {
        TableName: process.env.API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME,
        FilterExpression:
          '#owner_id <> :owner AND title IN (' +
          Object.keys(titleObject).toString() +
          ')',
        ExpressionAttributeValues: {
          ...titleObject,
          ':owner': event.arguments.owner,
        },
        ExpressionAttributeNames: {
          '#owner_id': 'owner',
        },
      };

      docClient.scan(matchedTodosParams, function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data.Items);
        }
      });
    }
  });
};

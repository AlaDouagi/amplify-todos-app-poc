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

const hashKey = 'id';
const rangeKey = null;

exports.handler = function (event, context, callback) {
  if (event.typeName === 'Mutation' && event.fieldName === 'deleteAllTodos') {
    const scanParams = {
      TableName: process.env.API_AMPLIFYTODOSAPPPOCAPI_TODOTABLE_NAME,
    };

    docClient.scan(scanParams, function (err, data) {
      if (err) callback(err);
      // an error occurred
      else {
        if (data.Items.length === 0) {
          callback(null, []);
        } else {
          data.Items.forEach(function (obj, i) {
            const params = {
              TableName: scanParams.TableName,
              Key: buildKey(obj),
              ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
              ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
              ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
            };

            docClient.delete(params, function (err, dataItem) {
              if (err) callback(err);
              // an error occurred
              else if (i === data.Items.length - 1) callback(null, data.Items); // successful response
            });
          });
        }
      }
    });
  }
};

function buildKey(obj) {
  const key = {};
  key[hashKey] = obj[hashKey];
  if (rangeKey) {
    key[rangeKey] = obj[rangeKey];
  }

  return key;
}

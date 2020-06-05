const AWS = require('aws-sdk');

// check https://www.gravitywell.co.uk/insights/how-to-use-your-mocked-dynamodb-with-appsync-and-lambda/
const isFake = process.env.AWS_ACCESS_KEY_ID === 'fake';
const isUsingModelDirective = !!process.env.API_USES_MODEL_DIRECTIVE;

const region = isFake ? 'us-fake-1' : process.env.REGION;

// Write the type where @model directive was written
const tableName = 'Todo';

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region,
  endpoint:
    process.env.DYNAMODB_ENDPOINT ||
    `https://dynamodb.${process.env.REGION}.amazonaws.com`,
};

// We know we are mocking the DB and we'll use DynamoDB local.
let tableSuffix = '';
if (isFake) {
  tableSuffix = 'Table';
} else {
  tableSuffix = `-${process.env.API_XXXX_GRAPHQLAPIIDOUTPUT}-${process.env.env}`;
}

const todosTableName = isUsingModelDirective
  ? `${tableName}${tableSuffix}`
  : // TODO: Fix env variable name whenever it changes (after manual linking of DB)
    process.env.STORAGE_AMPLIFYTODOSAPPPOCDB_NAME;

const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

const params = {
  TableName: todosTableName,
};

function getCoins(callback) {
  docClient.scan(params, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data.Items);
    }
  });
}

module.exports = getCoins;

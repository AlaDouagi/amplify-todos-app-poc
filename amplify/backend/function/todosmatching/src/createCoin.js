const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

// check https://www.gravitywell.co.uk/insights/how-to-use-your-mocked-dynamodb-with-appsync-and-lambda/
const isFake = process.env.AWS_ACCESS_KEY_ID === 'fake';

const region = isFake ? 'us-fake-1' : process.env.REGION;
// FIXME: This is an old invalid DB table name, please change the env variable
// when linking a new DB table to this lambda funtion
const ddb_table_name = process.env.STORAGE_AMPLIFYTODOSAPPPOCDB_NAME;

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
// let tableSuffix = '';
// if (isFake) {
//   tableSuffix = 'Table';
// } else {
//   tableSuffix = `-${process.env.API_XXXX_GRAPHQLAPIIDOUTPUT}-${process.env.env}`;
// }

const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

function write(params, event, callback) {
  docClient.put(params, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, params.Item);
    }
  });
}

function createCoin(event, callback) {
  const currentDate = new Date().toISOString();

  const args = {
    ...event.arguments,
    id: uuid(),
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  const params = {
    TableName: isFake ? `${tableName}Table` : ddb_table_name,
    Item: args,
  };

  if (Object.keys(event.arguments).length > 0) {
    write(params, event, callback);
  }
}

module.exports = createCoin;

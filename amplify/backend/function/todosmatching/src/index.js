/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_AMPLIFYTODOSAPPPOCDB_ARN
	STORAGE_AMPLIFYTODOSAPPPOCDB_NAME
Amplify Params - DO NOT EDIT */ // amplify/backend/function/todosmatching/src/index.js
const getCoins = require('./getCoins');
const createCoin = require('./createCoin');

exports.handler = function (event, _, callback) {
  if (event.typeName === 'Mutation') {
    createCoin(event, callback);
  }
  if (event.typeName === 'Query') {
    getCoins(callback);
  }
};

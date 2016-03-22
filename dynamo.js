'use strict';
const AWS    = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

AWS.config.credentials = credentials;
AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const db = new AWS.DynamoDB();
const dbDocCli = new AWS.DynamoDB.DocumentClient();

module.exports.initDb = () => {
  return {
    dbDocCli:dbDocCli,
    db:db,
    config:AWS.config.credentials
  }
};


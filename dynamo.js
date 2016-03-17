/**
 * Created by maksym on 3/16/16.
 */
const AWS    = require('aws-sdk'),
    DynamoDB = require('aws-dynamodb');

//var credentials = new AWS.SharedIniFileCredentials({profile: 'local'});

//AWS.config.credentials = credentials;
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:5000"
});

var db = new AWS.DynamoDB();
var dynamodbstreams = new AWS.DynamoDBStreams();
var s3 = new AWS.S3();

module.exports.initDb = () => {
    return DynamoDB(db)
};

module.exports.hello = () => {
    console.log('hello')
};

//module.exports = {
//    storage:s3,
//    db:db,
//    dbStreams:dynamodbstreams
//};

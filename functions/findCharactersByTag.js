const co = require("co");
const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.LOTR_TABLE;

function* findCharactersByTag(tag) {
  const req = {
    TableName: tableName,
    FilterExpression: "contains(tags, :tag)",
    ExpressionAttributeValues: { ":tag": tag }
  };

  const res = yield dynamodb.scan(req).promise();
  return res.Items;
}

module.exports.handler = co.wrap(function* handler(event, context, callback) {
  let response = {
    statusCode: 400,
    body: JSON.stringify({ error: "Bad Request" })
  };

  if (event.body) {
    const req = JSON.parse(event.body);
    if (req.tag) {
      const characters = yield findCharactersByTag(req.tag);

      response = {
        statusCode: 200,
        body: JSON.stringify(characters)
      };
    }
  }

  callback(null, response);
});

const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
var bodyParser = require("body-parser");
const { message } = require("statuses");

var app = express();
app.use(bodyParser.json());

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "",
  secretAccessKey: "",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "product";

exports.add = async (params) => {
     if(params.isDiscount==="true"){
         params.isDiscount=true
     }
     else{
         params.isDiscount=false;
     }
  const item = {
    TableName: table,
    Item: {
      productID: uuidv4(),
      stock: params.stock,
      productName: params.productName,
      isDiscount: Number(params.isDiscount),
      category: {
        categoryId: Math.random(),
        categoryName: params.categoryName,
      },
    },
  };

  try {
    await docClient.put(item).promise();
    return {
      status: true,
      message: "product is added",
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

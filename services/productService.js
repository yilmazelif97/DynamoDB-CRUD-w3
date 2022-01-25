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
  if (params.isDiscount === "true") {
    params.isDiscount = true;
  } else if (params.isDiscount === "false") {
    params.isDiscount = false;
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

exports.getAll = async (params) => {
  const item = {
    TableName: table,
  };

  try {
    const data = await docClient.scan(item).promise();
    return {
      status: true,
      message: "fetched products",
      data: data,
    };
  } catch (err) {
    return {
      status: false,
      message: "error",
      err,
    };
  }
};

exports.getSingle = async (params) => {
  try {
    const item = {
      TableName: table,
      KeyConditionExpression: "productID=:productID",
      ExpressionAttributeValues: {
        ":productID": params.productID,
      },
    };

    const data = await docClient.query(item).promise();

    console.log(data);
    return {
      data: data,
    };
  } catch (err) {
    console.log(err);
  }

  //   var item = {
  //     TableName: table,

  //     Key: {
  //       productID: params.productID,
  //     },
  //   };

  //   try {
  //     const data = await docClient.get(item).promise();

  //     return {
  //       status: true,
  //       data: data,
  //     };
  //   } catch (err) {
  //     return {
  //       err,
  //     };
  //   }
};

exports.getDiscount = async (params) => {
  try {
    const item = {
      TableName: table,
      Key: {},
      FilterExpression: "isDiscount = :isDiscount",

      ExpressionAttributeValues: {
        ":isDiscount": 1,
      },
    };


    const data = await docClient.scan(item).promise();

    console.log(data);
    return {
      data: data,
    };
  } catch (err) {
    console.log(err);
  }
};





//önce şartı sağlayan veriyi çok sonra sil

exports.delete = async(params)=>{

  var deletedID = params.productID;

  var item = {
    TableName: table,
    Key: {
      productID: deletedID,
    },
    ConditionExpression: "isDiscount = :isDiscount",
     ExpressionAttributeValues: {
            ":isDiscount": 0,
      },
  };

  try {
    await docClient.delete(item).promise();
    return {
      status: true,
      message:"post is deleted"
    };
  } catch (err) {
    return {
        status:false,
        message:"it has discount, you cant delete"
    }
  }
}
    // const item={
    //     TableName:table,
    //      Key:{
    //          productID : params.productID,
    //      },

        
    //     ConditionExpression: "isDiscount = :isDiscount",
    //     ExpressionAttributeValues: {
    //         ":isDiscount": 1,
    //       },
        
    // }

    // try {
    //     const deneme=await docClient.delete(item).promise()
    //     return {
    //       status: true,
    //       message:"product is deleted"
    //     };
    //   } catch (err) {
    //     return {
    //         status:false,
    //         message:err
    //     }
    //   }


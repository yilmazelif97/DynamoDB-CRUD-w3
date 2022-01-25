const express = require("express");
const Router = require("router");
var bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.json())


var router = Router();

const productController = require("../controllers/productController");

router.post('/add', productController.addProduct )

module.exports = router;

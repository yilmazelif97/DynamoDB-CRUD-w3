const express = require("express");
const Router = require("router");
var bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.json())


var router = Router();

const productController = require("../controllers/productController");

router.post('/add', productController.addProduct )
router.get('/getall', productController.getAllProduct)
router.get('/get/:productID', productController.getSingleProduct)
router.get('/getdiscount', productController.getDiscount)

module.exports = router;

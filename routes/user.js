const router = require("express").Router();
const productSchema = require("../model/productSchema");
const {getAllProducts,getProductById,createNewUser,loginUser,createNewProduct} = require("../control/ecomControl")
const {isAdmin} = require("../control/ecomControl");
//product routes:
router.get('/v1/products', getAllProducts);
router.get('/v1/products/:id', getProductById);

// Auth routes
router.post('/v1/auth/register', createNewUser);
router.post('/v1/auth/login', loginUser);
//
router.post('/v1/product',isAdmin,createNewProduct)



module.exports = router;
const router = require("express").Router();
const productSchema = require("../model/productSchema");
const {getAllProducts,getProductById,createNewUser,loginUser} = require("../control/ecomControl")

//product routes:
router.get('api/v1/products', getAllProducts);
router.get('api/v1/products/:id', getProductById);

// Auth routes
router.post('api/v1/auth/register', createNewUser);
router.post('api/v1/auth/login', loginUser);




module.exports = router;
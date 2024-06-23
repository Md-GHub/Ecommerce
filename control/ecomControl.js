const productSchema = require("../model/productSchema")
const {User,check} = require("../model/userSchema")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
//jwt token generator:
const tokens= async (id)=>{
    try{
        const key = await jwt.sign({id},"efknvcnvmd"); //add sessions
        return key;
    }catch(e){
        console.log(e.message);
    }
}
//security check for admin:
const isAdmin = (req, res, next) => {
    // Check if user is logged in and has admin role
    if (req.user && req.user.role === 'admin') {
        next(); // User is authorized, continue to next middleware/route handler
    } else {
        res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
};
//to create new user:
const createNewUser = async (req,res)=>{
    const { username, email, password, role, createdAt } = req.body;
    try{
        const newUser = new User({ username, email, password, role, createdAt });
        newUser.save(); 

        const token =await tokens(newUser._id); 
        res.status(400).json({
            message:"user registered",
            client :newUser, //password has to remove
            token
        })
    }catch(e){
        console.log(e.message);
        res.status(400).json({
            message:"unsuccess to register a user",
        })
    }
}
//to login and generate jwt tokens:
const loginUser = async (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({
            message:"Check the password or username"
        })
    }
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).json({
            message:"Check the password or username"
        })
    }
    const checks = await check(password,user.password);
    if(!checks){
        return res.status(400).json({
            message:"Check the password or username"
        })
    }
    console.log(user._id);
    const token = await tokens(user._id);
    res.status(200).json({
        status:"Success",
        token
    })
}
//get product by id or name
const getProductById = async (req, res) => {
    try {
        const { id } =await req.params;
        console.log(id);
        const item = await productSchema.findOne({ _id: id });
        
        if (!item) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ item });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Error retrieving product" });
    }
}

//get all the items
const getAllProducts = async (req, res) => {
    try {
        console.log("hi");
        const items = await productSchema.find({}); // Fetch all products from the database
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: {
                products: items
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const createNewProduct = async (req,res)=>{
    try{
        const {productName,description,price,category,imageUrl,quantity,createdAt} = req.body;
        const newProduct =await new productSchema({productName,description,price,category,imageUrl,quantity,createdAt});
        newProduct.save();

        res.status(200).json({
            status:"Success",
            detatils:{
                new_product:newProduct
            }
        })
    }catch(e){
        console.log(e.message);
        res.status(400).json({
            status:"error"
        })
    }
    
}

module.exports = {getAllProducts,getProductById,loginUser,createNewUser,createNewProduct,isAdmin}
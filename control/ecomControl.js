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
const getProductById = async (req,res)=>{
    const { productName } = req.body;   //make it as product id
    const items = await productSchema.findOne({productName});
    res.status(200).json({
        items
    })
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



module.exports = {getAllProducts,getProductById,loginUser,createNewUser}
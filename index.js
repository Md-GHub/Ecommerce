const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/user")
const {connect} = require("./model/connectDb"); 
const productSchema = require("./model/productSchema");
const {getAllProducts,getProductById} = require("./control/ecomControl")
dotenv.config()
const app =express();

app.use(express.json());

//routes:
app.get('/',(req,res)=>{
    console.log("Hello from /");
})


async function connectdb(){
    await connect();
    app.listen(5000,()=>
        console.log("Server started")
);

}
connectdb();
const mongoose = require("mongoose");

const connect = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/Ecom");
        console.log("connected to database");
    }catch(e){
        console.log("error in connecting database",e.message);
    }
}


module.exports = {connect};
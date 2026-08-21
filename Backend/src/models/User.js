const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    clearkId:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
    },
    profilepic:{
        type:String,
        default:""
    }
},
    {timestamps:true},
)

const User = mongoose.model("User",userSchema);

export default User;
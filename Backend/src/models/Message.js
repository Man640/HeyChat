const mongoose = require("mongoose");

const messsageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requiredw:true,
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    },
    Image:{
        type:String,
    },
    video:{
        type:String,
    },
},
    {timestamps:true},
)

const Message = mongoose.model("Message",messsageSchema);

export default Message;
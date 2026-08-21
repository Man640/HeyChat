const mongoose = require('mongoose');


 async function connectDB(){
    try{
       const mongoUri = process.env.MONGO_URI
       
       if(!mongoUri){
        throw new Error("MONGO_URI is required")
       }

       const conn = await mongoose.connect(mongoUri)

       console.log("Mongodb connected", conn.connection.host)
    }catch(error){
        console.error("MongoDb connection error:",error.message);
        process.exit(1)
    }
}
module.exports = { connectDB };
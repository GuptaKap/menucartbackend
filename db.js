const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL;
async function ConnectToMongo(){
    try{
        await mongoose.connect(`${DATABASE_URL}project`);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB")
    }
    

}
module.exports = ConnectToMongo;
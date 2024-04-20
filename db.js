const mongoose = require('mongoose');

async function ConnectToMongo(){
    try{
        await mongoose.connect('mongodb+srv://anushkagupta5020:root@cluster0.5xgxif3.mongodb.net/project');
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB")
    }
    

}
module.exports = ConnectToMongo;
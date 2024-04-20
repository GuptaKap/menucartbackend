const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type:String,
    unique:true,
    required: true
  },

    contactNo: {
      type: String, 
      required: true
    },
   
  date:{
    type: Date,
    default: Date.now
  },
  
  
  // other fields...
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
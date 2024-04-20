const mongoose = require('mongoose')
const menuSchema = new mongoose.Schema({

  Rname: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  imageUrl:{
    type:String,
    required:true
  },
    
  // }
  date: {
    type: Date,
    default: Date.now
  },


  // other fields...
});

const MenuModel = mongoose.model('menu', menuSchema);

module.exports = MenuModel;
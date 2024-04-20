const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '' // Default value for the image field
  }
});

const CategoryModel = mongoose.model('Category', categorySchema); // Capitalize the model name

module.exports = CategoryModel;

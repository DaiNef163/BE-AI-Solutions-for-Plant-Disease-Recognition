const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { schema } = require('./post');
mongoose.plugin(slug)
const Schema = mongoose.Schema;

const Product = new Schema({
  title:  String ,
  description: String,
  price:  Number,
  discountPercentage:  Number,
  stock:  Number,
  thumbnail: String,
  slug: { 
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type : Boolean,
    default : false
  },
},{
  timestamps :true
})

module.exports=mongoose.model('Product', Product, 'products');
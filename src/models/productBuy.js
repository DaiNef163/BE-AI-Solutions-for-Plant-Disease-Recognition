const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsBuy = new Schema({
    userId:String,
    paymentId:String,
    productName: [{
      productName: String,
      quantity: Number
    }],
    totalCost:Number,
    buyDate: {
        type: Date,
        default: Date.now,
      }
  },{
    timestamps :true
  })
  
  module.exports=mongoose.model('ProductsBuy', ProductsBuy, 'ProductsBuys'); 
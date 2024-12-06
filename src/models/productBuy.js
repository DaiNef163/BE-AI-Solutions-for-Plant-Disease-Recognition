const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsBuy = new Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    productName: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: Number
    }],
    totalCost:Number,
    info:{
      phone:String,
      address: String,
    },
    buyDate: {
        type: Date,
        default: Date.now,
      }
  },{
    timestamps :true
  })
  
  module.exports=mongoose.model('ProductsBuy', ProductsBuy, 'ProductsBuys'); 
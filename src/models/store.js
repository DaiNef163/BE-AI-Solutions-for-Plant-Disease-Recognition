const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const Schema = mongoose.Schema;

const Stores = new Schema({
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Accounts'
    },
    storeName:  String,
    address: String,
    slug: { 
        type: String,
        slug: "storeName",
        unique: true
      },
    deleted: {  
      type : Boolean,
      default : false
    },
    deletedAt : Date,
    updatedBy:[{
      account_id: String,
      updatedAt: Date
    }]
  },{
    timestamps :true
})

module.exports=mongoose.model('Stores', Stores, 'stores');

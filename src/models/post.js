const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Posts = new Schema({
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Accounts"
  },
  title: String,
  text: String,
  image: String,
  name: String,
  comments: [{
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    text: {
        type: String
    },
    name:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
  }],
  date:{
    type: Date,
    default: Date.now
  }
},{
  timestamps :true
})

module.exports=mongoose.model('Posts', Posts, 'posts'); 
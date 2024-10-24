const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPassword = new Schema({
  email: String,
  otp: String,
  expireAt:{type : Date, expires:180}
},{
  timestamps :true
})

module.exports=mongoose.model('forgotPassword', forgotPassword, 'forgot-password');
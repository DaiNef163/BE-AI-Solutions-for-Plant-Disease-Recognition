// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const genaration = require('../helper/genaration.js');


// const Accounts = new Schema({
//   fullName:  String,
//   email: String,
//   password: {
//     type: String,
//   },
//   tokenUser: {
//     type: String,
//     default : genaration.generateRandomString(20)
//   },
//   role: {
//     type : String,
//     default : "Staff"
//   },
//   avatar: String,
//   deleted: {
//     type : Boolean,
//     default : false
//   },
//   deletedAt: Date
// },{
//   timestamps :true
// })

// module.exports=mongoose.model('Accounts', Accounts, 'accounts'); 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Treatment = new Schema({
    title:  String ,
    description: String,
    treatment: String,
    deleted: {
    type : Boolean,
    default : false
    },
    deletedAt : Date,
    },{
    timestamps :true
}
)

module.exports=mongoose.model('Treatment', Treatment, 'treatments');

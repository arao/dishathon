const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const channelSchema = new Schema({
    name: {type: String, required:true, unique: true, caseSensitive:false},
    weight: {type: Number, required:true, default:1},
    number:{type:Number, default:15},
    link:{type:String, required:true},
    category:{type:String, caseSensitive:false}
}, {timestamps: true});
module.exports = mongoose.model('channels', channelSchema, 'channels');
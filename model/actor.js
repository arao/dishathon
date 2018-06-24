const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const actorSchema = new Schema({
    firstname: {type: String, required:true, caseSensitive:false},
    lastname: {type: String, caseSensitive:false},
    channel: { type: Schema.Types.ObjectId, ref: 'channels' },
    expires:{type:Number, default:3600}
}, {timestamps: true});
module.exports = mongoose.model('actor', actorSchema, 'actor');
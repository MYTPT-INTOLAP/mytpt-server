const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const reportSchema = new Schema({
    peopleId: {
        type: ObjectId,
        ref: 'People'
    },
    secreatKey: {
        type: String,
        trim: true
    },
    tokenId: {
        type: String,
        trim: true
    },
    teamId: {
        type: ObjectId,
        ref: 'team',
        required: true
    } 
    
}, {
    timestamps: true,
    versionKey: false
})


module.exports = new mongoose.model('report', reportSchema);
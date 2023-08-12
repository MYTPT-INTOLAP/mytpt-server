const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const infoSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    infoCard: {
        type: String , 
        trim: true
    },
    infoMassage: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('info', infoSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const noteSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    noteCard: {
        type: String , 
        trim: true
    },
    noteMassage: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('note', noteSchema);
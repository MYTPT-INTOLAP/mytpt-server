const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const linkSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    linkName: {
        type: String,
        trim: true
    },
    purpose: {
        type: String,
        trim: true
    },
    tasks: [{
        type: String,
        trim: true
    }],
    owner: {
        type: ObjectId,
        ref: 'People',
        trim: true
    },
    standIn: {
        type: ObjectId,
        ref: 'People',
        trim: true
    },
    // memberIn: [{
    //     owner: {
    //         type: ObjectId,
    //         trim: true
    //     }
    // }],
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true,
    versionKey: false
})


module.exports = new mongoose.model('links', linkSchema);
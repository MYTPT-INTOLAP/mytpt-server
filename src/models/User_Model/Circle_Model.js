const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const circleSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    circleName: {
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
    lead: {
        type: ObjectId,
        ref: 'People',
        ref: 'Skill',
        ref: 'Roles'
    },
    leadToDos: [{
        type: String,
        trim: true
    }],
    meetings: [{
        type: ObjectId,
        ref: 'Meeting'
    }],
    standIn: {
        type: ObjectId,
        ref: 'People'
    },
    administration: [{
        statusReport: {
            type: String,
            trim: true
        },
        owner: {
            type: ObjectId,
            ref: 'People'
        },
        _id: false
    }],
    defaultCircle: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }]
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('circle', circleSchema);
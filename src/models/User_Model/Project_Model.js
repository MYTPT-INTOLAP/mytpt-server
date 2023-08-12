const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const projectSchema = new mongoose.Schema({
    teamId: {
        type: ObjectId,
        ref: 'team',
        required: true
    },
    projectName: {
        type: String,
        required: true,
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
        ref: 'Meeting',
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
    tags: [{
        type: String,
        trim: true
    }]
}, { timestamps: true, versionkey: false })


module.exports = new mongoose.model('Projects', projectSchema)
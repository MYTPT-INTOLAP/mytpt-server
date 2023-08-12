const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SkillSchema = new mongoose.Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    skillName: {
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
    ownerType: {
        type: String,
        enum: ['Single owner', 'Multiple owners'],
        default: 'Single owner',
        trim: true,
    },
    owners: [{
        type: ObjectId,
        ref: 'People'
    }],
    domains: [{
        domain: {
            type: ObjectId,
            ref: "Domain",
        },
        owner: {
            type: ObjectId,
            ref: 'People'
        },
        _id: false
    }],
    // memberIn: [{
    //     type: String,
    //     trim: true,
    // }],
    tags: [{
        type: String,
        trim: true,
    }],
}, { timestamps: true, versionkey: false })


module.exports = new mongoose.model('Skill', SkillSchema)


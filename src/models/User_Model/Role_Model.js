const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const roleSchema = new mongoose.Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    roleName: {
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
    ownerRole: {
        type: String,
        enum: ['Single owner', 'Multiple owners'],
        default: 'Multiple owners',
        trim: true,
    },
    owners: [{
        type: ObjectId,
        ref: 'People'
    }],
    domains: [{
        domain: {
            type: ObjectId,
            ref: 'Domain'
        },
        owner: {
            type: ObjectId,
            ref: 'People'
        }
    }],
    defaultRole: {
        type: Boolean,
        default: false
    },
    // memberIn: [{
    //     type: ObjectId,
    //     trim: true,
    // }],
    tags: [{
        type: String,
        trim: true,
    }],
}, { timestamps: true, versionkey: false })


module.exports = new mongoose.model('Roles', roleSchema)
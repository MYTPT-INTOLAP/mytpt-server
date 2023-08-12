const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const domainSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    domainName: {
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
    owners: {
        type: {
            type: ObjectId,
            ref: 'People',
            ref: 'Skill',
            ref: 'Roles'
        },
        owner: {
            type: ObjectId,
            ref: 'People'
        },
        _id : false
    },
    standIn: {
        type: ObjectId,
        ref: 'Pepole'
    },
    defaultDomain: {
        type: Boolean,
        default: false
    },
    // memberIn: [{
    //     owner: {
    //         type: ObjectId,
    //         ref: 'Circle ',
    //         ref: 'Projects'
    //     },
    //     _id : false
    // }],
    tags: [{
        type: String,
        trim: true
    }]
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('Domain', domainSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const memberSchema = new Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    memberType: {
        type: ObjectId,
        ref: 'circle',
        ref: 'Projects'
    },
    coreMembers: {
        People: [{
            type: ObjectId,
            ref: 'people',
        }],
        Skills: [{
            type: ObjectId,
            ref: 'Skill',
        }],
        Roles: [{
            type: ObjectId,
            ref: 'Roles',
        }],
        Links: [{
            type: ObjectId,
            ref: 'links',
        }],
        Domains: [{
            type: ObjectId,
            ref: 'Domain',
        }],
        Circles: [{
            type: ObjectId,
            ref: 'circle',
        }],
        Projects: [{
            type: ObjectId,
            ref: 'Projects',
        }],
    },
    extendedMembers: {
        People: [{
            type: ObjectId,
            ref: 'people',
        }],
        Skills: [{
            type: ObjectId,
            ref: 'Skill',
        }],
        Roles: [{
            type: ObjectId,
            ref: 'Roles',
        }],
        Links: [{
            type: ObjectId,
            ref: 'links',
        }],
        Domains: [{
            type: ObjectId,
            ref: 'Domain',
        }],
        Circles: [{
            type: ObjectId,
            ref: 'circle',
        }],
    },
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('member', memberSchema);




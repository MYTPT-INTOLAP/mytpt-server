const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const pfmemberSchema = new Schema({
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
        Skills: [{
            CardId: {
                type: ObjectId,
                ref: 'Skill',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Roles: [{
            CardId: {
                type: ObjectId,
                ref: 'Roles',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Links: [{
            CardId: {
                type: ObjectId,
                ref: 'links',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Domains: [{
            CardId: {
                type: ObjectId,
                ref: 'Domain',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }]
    },
    extendedMembers: {
        Skills: [{
            CardId: {
                type: ObjectId,
                ref: 'Skill',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Roles: [{
            CardId: {
                type: ObjectId,
                ref: 'Roles',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Links: [{
            CardId: {
                type: ObjectId,
                ref: 'links',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }],
        Domains: [{
            CardId: {
                type: ObjectId,
                ref: 'Domain',
            },
            peopleIds: {
                type: ObjectId,
                ref: 'people',
            },
            _id: false
        }]
    },
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = new mongoose.model('pfmember', pfmemberSchema);




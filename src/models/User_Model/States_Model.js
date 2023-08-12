const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const AllSchema = new mongoose.Schema({
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    Person:[{
        type: ObjectId,
        ref: 'People'
    }],
    Skills:[{
        type: ObjectId,
        ref: 'Skill'
    }],
    Roles:[{
        type: ObjectId,
        ref: 'Roles'
    }],
    Domains:[{
        type: ObjectId,
        ref: 'domain'
    }],
    Links:[{
        type: ObjectId,
        ref: 'links'
    }],
    Circles:[{
        type: ObjectId,
        ref: 'circles'
    }],
    Projects:[{
        type: ObjectId,
        ref: 'Projects'
    }],
    TeamLists:[{
        type: String,
        require : true
    }],
},{timestamps: true, versionkey: false})


module.exports = new mongoose.model('States', AllSchema)
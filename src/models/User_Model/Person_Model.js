const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const PeopleSchema = new mongoose.Schema({
    teamId:{
        type: ObjectId,
        ref: 'team'
    },
    fname:{
        type: String,
        required: true,
        trim: true
    },
    lname:{
        type: String,
        befault: null,
        trim: true
    },
    mobile:{
        type: String,
        befault: null,
        trim: true
    },
    email:{
        type: String,
        befault: null,
        trim: true
    },
    workRole:{
        type: String,
        enum : ['Internal','External'],
        default: 'internal',
        trim: true,
    },
    mentor:{
        type: ObjectId,
        befault: null,
        ref: 'People'
    },
    mentees:[{
        type: ObjectId,
        befault: null,
        ref: 'People'
    }],
    tags:[{
        type: String,
        befault: null,
        trim: true,
    }],
},{timestamps: true, versionkey: false})


module.exports = mongoose.model('People', PeopleSchema)

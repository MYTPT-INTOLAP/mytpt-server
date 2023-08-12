const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const usermetaSchema = new mongoose.Schema({
    userId:{
        type: ObjectId,
        ref: 'user'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    plan:{
        type: String,
        enum: ['FTrial', 'CLicense', 'FLicense', 'Consulting', 'Lifetime'],
        default: 'FTrial'
    },
    validate: {
        type: String,
        default: null
    },
    userUrl:{
        type: String,
        default: null
    },
    session_id:{
        type: String,
        default: null
    },
    sessionToken:{
        type: String,
        default: null
    },
    isActive2fa: {
        type: Boolean,
        default: false
    },
    is2fasecret:{
        type: String,
        default: null
    }
},{timestamps: true, versionkey: false})


module.exports = mongoose.model('Usermeta', usermetaSchema);

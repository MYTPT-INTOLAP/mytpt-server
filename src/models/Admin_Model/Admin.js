const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        require: true
    },
    companyName:{
        type: String,
    },
    role:{
        type: String,
        enum: ['Admin','User'],
        default: 'User'
    },
    email:{
        type: String,
        require: true
    },
    issSignIn:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        require: true
    },
    curTeam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    }

},{timestamps: true, versionkey: false})


module.exports = mongoose.model('User', userSchema);

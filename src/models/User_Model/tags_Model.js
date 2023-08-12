const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const tegSchema = new mongoose.Schema({
    userId:{
        type: ObjectId,
        ref: 'User'
    },
    tags:[{
        type: String,
        require: true,
        trim: true,
    }],
},{timestamps: true, versionkey: false})


module.exports = new mongoose.model('Tegs', tegSchema)
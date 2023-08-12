const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId


const teamSchema = new Schema({
    team_name: {
        type: String,
        trim: true
    },
    archived: {
        type: Boolean,
        default: false
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
})


module.exports = new mongoose.model('team', teamSchema);
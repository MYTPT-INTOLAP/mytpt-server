const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId


const historySchema = new Schema({
    cardId: {
        type: ObjectId,
        ref: 'people',
        ref: 'Roles',
        ref: 'Skill',
        ref: 'Domain',
        ref: 'links',
        ref: 'circle',
        ref: 'Projects'
    },
    teamId: {
        type: ObjectId,
        ref: 'team'
    },
    field: {
        type: String,
        trim: true,
    },
    prev: {
        type: String,
        trim: true,
    },
    next: {
        type: String,
        trim: true,
    },
    hcTime: {
        type: String,
        trim: true,
    },
    cardStatus: {
        type: String,
        enum: ['created', 'added', 'changed', 'removed'],
        trim: true,
    }
}, {
    timestamps: true,
    versionKey: false
})


module.exports = new mongoose.model('history', historySchema);
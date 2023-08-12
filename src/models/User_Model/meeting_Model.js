const { default: mongoose } = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const meetingSchema = new mongoose.Schema({
    teamId:{
        type: ObjectId,
        ref: 'team'
    },
    meetingsName: {
        type: String,
        trim: true
    },
    meetingsPurpse: {
        type: String,
        trim: true
    },
    recurrence: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    durationType: {
        type: String,
        trim: true,
        enum: ["Minutes", "Hours", "As_needed"],
        default: "Minutes"
    },
    recurrenceType: {
        type: String,
        trim: true,
        enum: ["Day(s)", "Week(s)", "Month(s)", "Year(s)", "As_needed"],
        default: "Day(s)"
    },
    defaultMeeting: {
        type: Boolean,
        default: false
    },
    XTD: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Meeting', meetingSchema)



// meetingsName, meetingsPurpse, recurrence, duration, durationType, recurrenceType, XTD
const mongoose = require('mongoose')
const meetingModel = require("../../models/User_Model/meeting_Model");
const { isValideMeetings, isValideUpdateMeetings } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createMeetings = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const {teamId, meetingsName, meetingsPurpse, recurrence, duration, durationType, recurrenceType, XTD } = data
        // return res.status(200).send({ status: true, message: "ok", data: req.body })

        //Input data validation
        let msgUsersData = isValideMeetings(data)
        if (msgUsersData) {
            return res.status(400).send({ status: false, message: msgUsersData })
        }

        let Meeting = {
            teamId: teamId,
            meetingsName: meetingsName,
            meetingsPurpse: meetingsPurpse,
            recurrence: recurrence,
            duration: duration,
            durationType: durationType,
            recurrenceType: recurrenceType,
            XTD: XTD
        }

        var meetingId = await meetingModel.create(Meeting);

        return res.status(201).send({ status: true, message: "New meeting created successfully", data: meetingId });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getMeetings = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.team

        let data = await meetingModel.find({ teamId: teamId })


        return res.status(200).send({ status: true, message: 'Meetings data get successfully', data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateMeetings = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const {teamId, meetingsName, meetingsPurpse, recurrence, duration, durationType, recurrenceType, XTD, _id } = data

        console.log(data)

        const oldata = await meetingModel.findOne({ teamId: teamId, _id: _id })
        if (!oldata) {
            return res.status(404).send({ status: false, message: "Data not found" });
        }
        console.log(oldata)
        //Input data validation
        let msgUsersData = isValideUpdateMeetings(data)
        if (msgUsersData) {
            return res.status(400).send({ status: false, message: msgUsersData })
        }
        console.log('85')
        // await meetingModel.findOneAndUpdate({ _id: meetingId }, oldData, { new: true });

        let resData = await meetingModel.findOneAndUpdate({ teamId: teamId, _id: _id}, data, { new: true });
        console.log(resData)
        return res.status(200).send({ status: true, message: "Meetings update successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteMeetings = async (req, res) => {
    try {
        // using destructuring of body data.
        let { teamid, meetingid } = req.headers

        console.log(meetingid)

        // Input data validation
        const isUniques = await meetingModel.findOne({ _id: meetingid, teamId: teamid });
        if (!isUniques) {
            return res.status(404).send({ status: true, message: "Meeting data not found" });
        }

        await meetingModel.findOneAndDelete({ _id: meetingid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Meeting is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createMeetings, getMeetings, updateMeetings, deleteMeetings }
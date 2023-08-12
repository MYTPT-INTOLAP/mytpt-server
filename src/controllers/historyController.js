const teamModel = require("../models/Team_Model/Team_Model");
const { isValideTeam, isValideUpdateTeam } = require("../dataValidation/dataValidation")
const personModel = require("../models/User_Model/Person_Model");
const skillModel = require("../models/User_Model/Skill_Model");
const roleModel = require("../models/User_Model/Role_Model");
const domainModel = require("../models/User_Model/Domain_Model");
const linkModel = require("../models/User_Model/Link_Model");
const circleModel = require("../models/User_Model/Circle_Model");
const projectModel = require("../models/User_Model/Project_Model");
const meetingModel = require("../models/User_Model/meeting_Model");
const historyModel = require("../models/History_Model/History_Model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();



const historyCreate = async (req, res) => {
    try {
        let cuHistoryData = req.body;

        let response = await historyModel.insertMany(cuHistoryData)

        return res.status(201).send({ status: true, message: "New history created successfully", data: response });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// /user/history/get

const historyget = async (req, res) => {
    try {
        let { cardid } = req.headers;

        // console.log(cardid);

        let response = await historyModel.find({ cardId: cardid })
        // console.log(response)

        return res.status(201).send({ status: true, message: "History get successfully", data: response });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





const historyUpdate = async (req, res) => {
    try {
        let { historyId, cardId, teamId, cardStatus } = req.body;

        let cuHistoryData = {
            cardId: cardId,
            teamId: teamId,
            cardStatus: cardStatus
        }

        let response = await historyModel.findOneAndUpdate({ _id: historyId }, cuHistoryData, { new: true })

        return res.status(201).send({ status: true, message: "History update successfully", data: response });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const historyDelete = async (req, res) => {
    try {
        let { historyId, cardId, teamId } = req.body;

        let data = await historyModel.findOne({ _id: historyId, cardId: cardId, teamId: teamId })

        if (Object.keys(data).length === 0) {
            return res.status(404).send({ status: false, message: "data not found" });
        }

        await historyModel.findOneAndDelete({ _id: historyId })

        return res.status(201).send({ status: true, message: "History deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { historyCreate, historyget, historyUpdate, historyDelete }
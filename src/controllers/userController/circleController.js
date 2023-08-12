const mongoose = require('mongoose')
const circleModel = require("../../models/User_Model/Circle_Model");
const meetingModel = require("../../models/User_Model/meeting_Model");
const tagsModel = require('../../models/User_Model/tags_Model')
const memberModel = require("../../models/User_Model/CandE_Members")
const { isValideCircle, isValideUpdateCircle } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();



// METHOD : CREATE

const createCircle = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, circleName, purpose, tasks, lead, leadToDos, meetings, projectId, standIn, administration, tags } = data;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })

        //Input data validation

        let msgUserData = isValideCircle(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //Create user data after format fname, lname, companyName
        const circleData = {
            teamId: teamId,
            circleName: circleName,
            purpose: purpose,
            tasks: tasks,
            lead: lead ? lead : null,
            leadToDos: leadToDos,
            meetings: meetings,
            standIn: standIn ? standIn : null,
            administration: administration,
            tags: tags,
        };

        // console.log(circleData);
        const newUser = await circleModel.create(circleData);

        if(projectId && projectId.length > 0 && newUser){
            let curMember = await memberModel.findOne({memberType: projectId})
            if(curMember){
                await memberModel.findOneAndUpdate({_id: curMember._id}, {memberType: newUser._id}, {new: true})
            }
        }

        return res.status(201).send({ status: true, message: "New circle created successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getCircle = async (req, res) => {
    try {
        // using destructuring of body data.
        let {teamid , curcircle} = req.headers
        let data = await circleModel.find({ teamId: teamid })

        let curCircleData = []
        let dCircleDatas = []
        if(data && data.length > 0){
            for(let i = 0; i < data.length; i++){
                if(data[i] && data[i].defaultCircle){
                    dCircleDatas.push(data[i])
                }else{
                    curCircleData.push(data[i])
                }
            }
        }

        let newCircleDatas = []
        if (curcircle && curcircle.length > 0) {
            curcircle = curcircle.split(",")
            for (let i = 0; i < curcircle.length; i++) {
                for (let j = 0; j < curCircleData.length; j++) {
                    let finalId = curCircleData[j]._id.toString()
                    // console.log(curcircle)
                    if (curcircle[i] === finalId) {
                        newCircleDatas.push(curCircleData[j])
                    }
                }
            }
        }else{
            newCircleDatas = [...data]
        }
        // console.log(newCircleDatas)
 
        return res.status(200).send({ status: true, message: 'circle data get successfully', data: newCircleDatas, fData: dCircleDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateCircle = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, circleName, purpose, tasks, lead, leadToDos, meetings, standIn, administration, tags, _id } = data;


        const oldata = await circleModel.findOne({ teamId: teamId, _id: _id })
        if(!oldata){
            return res.status(404).send({ status: false, message: "data not found" });
        }

        //Input data validation
        let msgUserData = isValideUpdateCircle(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        // await meetingModel.findOneAndUpdate({ _id: meetingId }, oldData, { new: true });

        await circleModel.findOneAndUpdate({ _id: _id }, data, { new: true });
        return res.status(200).send({ status: true, message: "Circle update successfully"});

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteCircle = async (req, res) => {
    try {
        // using destructuring of body data.
        let {teamid, circleid} = req.headers

        console.log("ok")
        // Input data validation
        const isUnique = await circleModel.findOne({ _id: circleid, team: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: true, message: "Circle is not found" });
        }


        await circleModel.findOneAndDelete({ _id: circleid, team: teamid })
        // await meetingModel.findOneAndDelete({ _id: isUnique.meetings })
        return res.status(200).send({ status: true, message: "Circle is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createCircle, getCircle, updateCircle, deleteCircle }
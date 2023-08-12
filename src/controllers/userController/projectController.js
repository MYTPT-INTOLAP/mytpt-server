const projectModel = require("../../models/User_Model/Project_Model");
const meetingModel = require("../../models/User_Model/meeting_Model");
const tagsModel = require("../../models/User_Model/tags_Model")
const memberModel = require("../../models/User_Model/CandE_Members")
const { isValideProject, isValideMeetings, isValideUpdateProject, isValideUpdateMeetings } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();



// METHOD : CREATE

const createProject = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        // console.log(data)
        const { teamId, projectName, purpose, tasks, lead,administration , circleId, leadToDos, meetings, standIn,  tags } = data;
        //  console.log(43);
        let msgUserData = isValideProject(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }
        // console.log(msgUserData);


        //Create user data after format fname, lname, companyName
        const userData = {
            teamId: teamId,
            projectName: projectName,
            purpose: purpose,
            tasks: tasks,
            lead: lead,
            leadToDos: leadToDos,
            meetings: meetings,
            standIn: standIn,
            administration: administration,
            tags: tags,
        };

        const newUser = await projectModel.create(userData);

        if(circleId && circleId.length > 0 && newUser){
            let curMember = await memberModel.findOne({memberType: circleId})
            if(curMember){
                await memberModel.findOneAndUpdate({_id: curMember._id}, {memberType: newUser._id}, {new: true})
            }
        }


        return res.status(201).send({ status: true, message: "New project is created successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getProject = async (req, res) => {
    try {
        // using destructuring of body data.
        let {teamid , curproject } = req.headers
        let data = await projectModel.find({teamId: teamid})

        let newProjectDatas = []
        if (curproject && curproject.length > 0) {
            curproject = curproject.split(",")
            for (let i = 0; i < curproject.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    let finalId = data[j]._id.toString()
                    // console.log(curproject)
                    if (curproject[i] === finalId) {
                        newProjectDatas.push(data[j])
                    }
                }
            }
        }else{
            newProjectDatas = [...data]
        }
        // console.log(newProjectDatas)


        return res.status(200).send({ status: true, message: 'Project get successfully', data: newProjectDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateProject = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        // console.log(data);
        const { team, projectName, purpose, tasks, lead, leadToDos, meetings, standIn, administration, tags, projectId } = data;

        let teamId = req.body.teamId

        const oldata = await projectModel.findOne({ teamId: teamId, _id: data._id })
        if(!oldata){
            return res.stqtus(404).send({status: false, message: "Data not found"})
        }


        // Input data validation

        let msgUserData = isValideUpdateProject(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        console.log(data)

       await projectModel.findOneAndUpdate({ _id: data._id, team: teamId }, data, { new: true });
        return res.status(200).send({ status: true, message: "New Project update successfully"});

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// METHOD : DELETE

const deleteProject = async (req, res) => {
    try {
        // using destructuring of body data.
        let { projectid, teamid } = req.headers


        // Input data validation
        const isUnique = await projectModel.findOne({ _id: projectid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: true, message: "Project data not found" });
        }

        await projectModel.findOneAndDelete({ _id: projectid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Project is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createProject, getProject, updateProject, deleteProject }
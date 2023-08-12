const skillModel = require("../../models/User_Model/Skill_Model");
const circleModel = require("../../models/User_Model/Circle_Model");
const projectModel = require("../../models/User_Model/Project_Model");
const CandE_Members = require("../../models/User_Model/CandE_Members");
const domainModel = require("../../models/User_Model/Domain_Model");
const historyModel = require("../../models/History_Model/History_Model");
const { isValideSkill, isValideUpdateSkill, currentTime } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createskill = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, skillName, purpose, tasks, ownerType, roleId, owners, domains, memberIn, tags } = req.body;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })
        // console.log("ok")

        let newDomainData = []
        let newSDoaminData = []
        if (domains && domains.length > 0) {
            for (let i = 0; i < domains.length; i++) {
                let regex = /^[0-9a-fA-F]{24}$/
                if (domains[i] && domains[i].domain && domains[i].domain.length > 0 && !regex.test(domains[i].domain)) {
                    const domainData = {
                        teamId: teamId,
                        domainName: domains[i].domain,
                        prupose: '',
                        tasks: [],
                        owners: [],
                        standIn: null,
                        tags: [],
                    };
                    let newDomain = await domainModel.create(domainData)
                    if (newDomain) {
                        let historyObj = [{
                            cardId: newDomain._id,
                            teamId: teamId,
                            field: '',
                            prev: '',
                            next: '',
                            hcTime: currentTime(),
                            cardStatus: 'created'
                        }]
                        await historyModel.insertMany(historyObj)
                        newDomainData.push(newDomain._id.toString())
                        newSDoaminData.push({ domain: newDomain._id.toString(), owner: domains[i].owner.toString() })
                    }
                } else if (domains[i] && domains[i].domain && domains[i].domain.length > 0 && regex.test(domains[i].domain)) {
                    newSDoaminData.push(domains[i])
                }
            }
        }

        if (newSDoaminData && newSDoaminData.length > 0) {
            data.domains = newSDoaminData
        }

        //Input data validation
        let msgUserData = isValideSkill(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //Create user data after format fname, lname, companyName
        const userData = {
            teamId: teamId,
            skillName: skillName,
            purpose: purpose,
            tasks: tasks,
            ownerType: ownerType ? ownerType : 'Single owner',
            owners: owners,
            domains: data.domains,
            memberIn: memberIn,
            tags: tags,
        };


        const newUser = await skillModel.create(userData);


        if (roleId && roleId.length > 0 && newUser) {
            let curCircles = await circleModel.find({ teamId: teamId })
            let curProjects = await projectModel.find({ teamId: teamId })

            if (curCircles && curCircles.length > 0) {
                for (let l = 0; l < curCircles.length; l++) {
                    if (curCircles[l].lead.toString() === roleId.toString()) {
                        await circleModel.findOneAndUpdate({ _id: curCircles[l]._id }, { lead: newUser._id }, { new: true })
                    }
                }
            }

            if (curProjects && curProjects.length > 0) {
                for (let l = 0; l < curProjects.length; l++) {
                    if (curProjects[l].lead.toString() === roleId.toString()) {
                        await projectModel.findOneAndUpdate({ _id: curProjects[l]._id }, { lead: newUser._id }, { new: true })
                    }
                }
            }
        }

        return res.status(201).send({ status: true, message: "New skills created successfully", data: newUser, nDaoamin: newDomainData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET



const getskill = async (req, res) => {
    try {
        // using destructuring of body data.
        let { teamid, curskill } = req.headers
        // console.log(curskill)
        let data = await skillModel.find({ teamId: teamid })
        let newSkillDatas = []
        if (curskill && curskill.length > 0) {
            curskill = curskill.split(",")
            for (let i = 0; i < curskill.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    let finalId = data[j]._id.toString()
                    if (curskill[i] === finalId) {
                        newSkillDatas.push(data[j])
                    }
                }
            }
        } else {
            newSkillDatas = [...data]
        }

        // console.log(newSkillDatas)
        // let datas = await CandE_Members.find({teamId: teamid})

        return res.status(200).send({ status: true, message: "Skill get successfully", data: newSkillDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateskill = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        // console.log(data)
        const { teamId, skillName, purpose, tasks, ownerType, owners, domains, memberIn, tags, _id } = data;
        // let teamId = req.body.teamId

        const oldata = await skillModel.findOne({ teamId: teamId, _id: data._id })
        // return res.status(400).send({ status: false, message: oldata });

        if (!oldata) {
            return res.status(400).send({ status: false, message: "Invalid data" });
        }


        let newDomainData = []
        let newSDoaminData = []
        if (domains && domains.length > 0) {
            for (let i = 0; i < domains.length; i++) {
                let regex = /^[0-9a-fA-F]{24}$/
                if (domains[i] && domains[i].domain && domains[i].domain.length > 0 && !regex.test(domains[i].domain)) {
                    const domainData = {
                        teamId: teamId,
                        domainName: domains[i].domain,
                        prupose: '',
                        tasks: [],
                        owners: [],
                        standIn: null,
                        tags: [],
                    };
                    let newDomain = await domainModel.create(domainData)
                    if (newDomain) {
                        let historyObj = [{
                            cardId: newDomain._id,
                            teamId: teamId,
                            field: '',
                            prev: '',
                            next: '',
                            hcTime: currentTime(),
                            cardStatus: 'created'
                        }]
                        await historyModel.insertMany(historyObj)
                        newDomainData.push(newDomain._id.toString())
                        newSDoaminData.push({ domain: newDomain._id.toString(), owner: domains[i].owner.toString() })
                    }
                } else if (domains[i] && domains[i].domain && domains[i].domain.length > 0 && regex.test(domains[i].domain)) {
                    newSDoaminData.push(domains[i])
                }
            }
        }

        if (newSDoaminData.length > 0) {
            data.domains = newSDoaminData
        }

        //Input data validation

        let msgUserData = isValideUpdateSkill(data, oldata)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }
        await skillModel.findOneAndUpdate({ _id: data._id, teamId: teamId }, data, { new: true });
        return res.status(200).send({ status: true, message: "New skill update successfully", nDaoamin: newDomainData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteskill = async (req, res) => {
    try {
        // using destructuring of body data.
        const { skillid, teamid } = req.headers

        // console.log(teamid)
        // Input data validation
        const isUnique = await skillModel.findOne({ _id: skillid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "data not found" })
        }
        // console.log(skillId)
        // console.log(teamId)

        await skillModel.findOneAndDelete({ _id: skillid, teamid: teamid })
        return res.status(200).send({ status: true, message: "Skill profile is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createskill, getskill, updateskill, deleteskill }
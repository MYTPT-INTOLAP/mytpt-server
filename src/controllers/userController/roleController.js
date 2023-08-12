const roleModel = require("../../models/User_Model/Role_Model");
const circleModel = require("../../models/User_Model/Circle_Model");
const projectModel = require("../../models/User_Model/Project_Model");
const skillModel = require("../../models/User_Model/Skill_Model");
const domainModel = require("../../models/User_Model/Domain_Model");
const historyModel = require("../../models/History_Model/History_Model");
const { isValideRole, isValideUpdateRole , currentTime} = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createRole = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, roleName, purpose, tasks, ownerRole, skillId, owners, domains, defaultRole, memberIn, tags } = req.body;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })



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
        let msgUserData = isValideRole(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //Create user data after format fname, lname, companyName
        const userData = {
            teamId: teamId,
            roleName: roleName,
            purpose: purpose,
            tasks: tasks,
            ownerRole: ownerRole,
            owners: owners,
            domains: data.domains,
            defaultRole: defaultRole,
            memberIn: memberIn,
            tags: tags,
        };
        const newUser = await roleModel.create(userData);


        if (skillId && skillId.length > 0 && newUser) {
            let curCircles = await circleModel.find({ teamId: teamId })
            let curProjects = await projectModel.find({ teamId: teamId })

            if (curCircles && curCircles.length > 0) {
                for (let l = 0; l < curCircles.length; l++) {
                    if (curCircles[l].lead.toString() === skillId.toString()) {
                        await circleModel.findOneAndUpdate({ _id: curCircles[l]._id }, { lead: newUser._id }, { new: true })
                    }
                }
            }

            if (curProjects && curProjects.length > 0) {
                for (let l = 0; l < curProjects.length; l++) {
                    if (curProjects[l].lead.toString() === skillId.toString()) {
                        await projectModel.findOneAndUpdate({ _id: curProjects[l]._id }, { lead: newUser._id }, { new: true })
                    }
                }
            }
        }


        return res.status(201).send({ status: true, message: "New Role created successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getRole = async (req, res) => {
    try {
        // using destructuring of body data.
        let { teamid, currole } = req.headers
        //   console.log(teamid)
        //   console.log(currole)
        let data = await roleModel.find({ teamId: teamid })


        let CurRoleData = []
        let dRoleDatas = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] && data[i].defaultRole) {
                    dRoleDatas.push(data[i])
                } else {
                    CurRoleData.push(data[i])
                }
            }
        }

        let newRoleDatas = []
        if (currole && currole.length > 0) {
            currole = currole.split(",")
            for (let i = 0; i < currole.length; i++) {
                for (let j = 0; j < CurRoleData.length; j++) {
                    let finalId = CurRoleData[j]._id.toString()
                    // console.log(curskill)
                    if (currole[i] === finalId) {
                        newRoleDatas.push(CurRoleData[j])
                    }
                }
            }
        } else {
            newRoleDatas = [...data]
        }
        // console.log(newRoleDatas)


        return res.status(200).send({ status: true, message: 'Role get successfully', data: newRoleDatas, fData: dRoleDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateRole = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, roleName, purpose, tasks, ownerRole, owners, domains, memberIn, tags, _id } = data;


        const oldata = await roleModel.findOne({ teamId: teamId, _id: _id })
        if (!oldata) {
            return res.status(404).send({ status: false, message: "Data not found" })
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


        // console.log(data)
        //Input data validation

        let msgUserData = isValideUpdateRole(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        await roleModel.findOneAndUpdate({ _id: _id, teamId: teamId }, data, { new: true });
        return res.status(200).send({ status: true, message: "New Role update successfully", nDaoamin: newDomainData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteRole = async (req, res) => {
    try {
        // using destructuring of body data.
        let { roleid, teamid } = req.headers


        // Input data validation
        const isUnique = await roleModel.findOne({ _id: roleid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: true, message: "data not found" });
        }

        await roleModel.findOneAndDelete({ _id: roleid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Role profile is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createRole, getRole, updateRole, deleteRole }
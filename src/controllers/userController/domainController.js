const domainModel = require("../../models/User_Model/Domain_Model");
const tags_Model = require("../../models/User_Model/tags_Model")
const { isValideDomain, isValideUpdateDomain } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createDomain = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, domainName, purpose, tasks, owners, standIn, memberIn, tags } = data;
        let msgUserData = isValideDomain(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //Create user data after format fname, lname, companyName
        const userData = {
            teamId: teamId,
            domainName: domainName,
            prupose: purpose,
            tasks: tasks,
            owners: owners,
            standIn: standIn,
            memberIn: memberIn,
            tags: tags,
        };
        // console.log("ok")
        const newUser = await domainModel.create(userData);
        return res.status(201).send({ status: true, message: "New domain created successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getDomain = async (req, res) => {
    try {
        // using destructuring of body data.
        let {teamid,curdomain} = req.headers
        let data = await domainModel.find({ teamId: teamid })

        let CurDomainData = []
        let dDomainDatas = []
        if(data && data.length > 0){
            for(let i = 0; i < data.length; i++){
                if(data[i] && data[i].defaultDomain){
                    dDomainDatas.push(data[i])
                }else{
                    CurDomainData.push(data[i])
                }
            }
        }

        let newDomainDatas = []
        if (curdomain && curdomain.length > 0) {
            curdomain = curdomain.split(",")
            for (let i = 0; i < curdomain.length; i++) {
                for (let j = 0; j < CurDomainData.length; j++) {
                    let finalId = CurDomainData[j]._id.toString()
                    // console.log(curdomain)
                    if (curdomain[i] === finalId) {
                        newDomainDatas.push(CurDomainData[j])
                    }
                }
            }
        }else{
            newDomainDatas = [...CurDomainData]
        }
        // console.log(newDomainDatas)

        return res.status(200).send({ status: true, message: 'Domain get successfully', data: newDomainDatas, fData: dDomainDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateDomain = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, teamName, domainname, purpose, tasks, owners, standIn, memberIn, tags, _id } = data;

        const oldata = await domainModel.findOne({ teamId: teamId, _id: _id })
        // return res.status(400).send({ status: false, message: oldata });

        if (!oldata) {
            return res.status(404).send({ status: false, message: "Data not found" });
        }

        //Input data validation
        let msgUserData = isValideUpdateDomain(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const newUser = await domainModel.findOneAndUpdate({ _id: _id, teamId: teamId }, data, { new: true });
        return res.status(200).send({ status: true, message: "Domain update successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteDomain = async (req, res) => {
    try {
        // using destructuring of body data.
        let { domainid, teamid } = req.headers


        // Input data validation
        const isUnique = await domainModel.findOne({ _id: domainid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "Domain data is not found" });
        }


        await domainModel.findOneAndDelete({ _id: domainid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Domain is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createDomain, getDomain, updateDomain, deleteDomain }
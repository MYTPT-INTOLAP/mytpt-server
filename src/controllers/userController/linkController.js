const linkModel = require("../../models/User_Model/Link_Model");
const { isValideLink, isValideUpdateLink } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createLink = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, linkName, purpose, tasks,  owner, standIn, memberIn, tags } = data;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })

        //Input data validation
        let msgUserData =isValideLink(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const userData = {
            teamId: teamId,
            linkName: linkName,
            purpose: purpose,
            tasks: tasks,
            owner: owner,
            standIn: standIn,
            memberIn: memberIn,
            tags: tags,
        };

        const newUser = await linkModel.create(userData);
        return res.status(201).send({ status: true, message: "New Link created successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getLink = async (req, res) => {
    try {
        // using destructuring of body data.
        let {teamid , curlink} = req.headers
        //  console.log(teamid);
        let data = await linkModel.find({teamId: teamid})
        
        let newLinkDatas = []
        if (curlink && curlink.length > 0) {
            curlink = curlink.split(",")
            for (let i = 0; i < curlink.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    let finalId = data[j]._id.toString()
                    // console.log(curskill)
                    if (curlink[i] === finalId) {
                        newLinkDatas.push(data[j])
                    }
                }
            }
        }else{
            newLinkDatas = [...data]
        }
        // console.log(newLinkDatas)

        return res.status(200).send({ status: true, message: 'Link get successfully', data: newLinkDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateLink = async (req, res) => {
    try {
        // using destructuring of body data.
        let data  = req.body
        const {teamId, _id} = data;

        const oldata = await linkModel.findOne({ teamId: teamId, _id: _id })
        // return res.status(400).send({ status: false, message: oldata });

        if(!oldata){
            return res.status(404).send({ status: false, message: "Data not found" });
        }

        //Input data validation   
        let msgUserData = isValideUpdateLink(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }


        await linkModel.findOneAndUpdate({ _id: _id, teamId: teamId}, data, { new: true });
        return res.status(200).send({ status: true, message: "Link update successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteLink = async (req, res) => {
    try {
        // using destructuring of body data.
        let {linkid, teamid} = req.headers

        // Input data validation
        const isUnique = await linkModel.findOne({_id: linkid, team: teamid}); 
        if(!isUnique){
            return res.status(404).send({ status: false, message: "Link data is not found" });
        }

        await linkModel.findOneAndDelete({ _id: linkid, team: teamid })
        return res.status(200).send({ status: true, message: "Link is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {createLink, getLink, updateLink, deleteLink }
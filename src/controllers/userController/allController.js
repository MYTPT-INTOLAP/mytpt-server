const States_Model = require("../../models/User_Model/States_Model");
const { isValideTags } = require("../../dataValidation/dataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createsStates = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, Person, Skills, Roles,Domains, Links, Circles, Projects, TeamLists} = data;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })
        // console.log("ok")

        // console.log(data)

        //Create user data after format fname, lname, companyName
        const userData = {
            teamId: teamId,
            Person: Person ? Person : [],
            Skills: Skills ? Skills: [],
            Roles: Roles ? Roles : [],
            Domains : Domains ? Domains : [],
            Links : Links ? Links : [],
            Circles: Circles ? Circles : [],
            Projects: Projects ? Projects : [],
            TeamLists : TeamLists ? TeamLists : [],
        };

        const newUser = await States_Model.create(userData);
        // console.log(userData);
         return res.status(201).send({ status: true, message: "new states created successfully", data: newUser._id });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getStates = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.team
        // console.log(teamId)
        let data = await States_Model.findOne({teamId: teamId})
        // console.log(data)
        return res.status(200).send({ status: true, message: "states get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// @METHOD: UPDATE

const updateStates = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, Person, Skills, Roles, Domains, Links, Circles, Projects ,TeamLists} = data;

        // console.log(data)                                                                                                                     

        await States_Model.findOneAndUpdate({ teamId: teamId }, data, { new: true });
        return res.status(200).send({ status: true, message: "New States Update Successfully", });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteStates = async (req, res) => {
    try {
        // using destructuring of body data.
        const { teamid} = req.headers

        // console.log(teamid)
        // Input data validation
        // const isUnique = await States_Model.findOne({ teamId: teamid}); 
        // if(!isUnique){
        //     return res.status(404).send({status: false, message: "data not found"})
        // }

        await States_Model.findOneAndDelete({  teamid: teamid})
        return res.status(200).send({ status: true, message: "state is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {createsStates, getStates, updateStates, deleteStates }


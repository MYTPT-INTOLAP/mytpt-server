const personModel = require("../../models/User_Model/Person_Model");
const mongoose = require('mongoose')
const { isValidePerson, isValideUpdatePerson, isValideUpdateAdmin } = require("../../dataValidation/dataValidation")
const { isValideTags } = require('../../dataValidation/inputDataValidation')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const tags_Model = require("../../models/User_Model/tags_Model");
require('dotenv').config();


// METHOD : CREATE

const createPerson = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, fname, lname, mobile, email, workRole, mentor, mentees, tags } = data;

        //Input data validation
        let msgUserData = isValidePerson(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (email) {
            const isEmailUnique = await personModel.findOne({ email:email, teamId:teamId });
            if (isEmailUnique) {
                return res.status(400).send({ status: false, message: `email: ${email} already exist` });
            }
        }

        //Create user data after format fname, lname, companyName

        const userData = {
            teamId: teamId, fname: fname,
            lname: lname ? lname : "  ", mobile: mobile,
            email: email, workRole: workRole ? workRole : "Internal",
            mentor: mentor, mentees: mentees, tags: tags
        };

        let newPeople = await personModel.create(userData);
        return res.status(201).send({ status: true, message: "New person registered successfully", data: newPeople });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET

const getPerson = async (req, res) => {
    try {
        // using destructuring of body data.
        let { teamid, curpeople } = req.headers
        // console.log(curpeople.split(','))
        let data = await personModel.find({ teamId: teamid })//.populate("People")//.populate({ path: 'People', model: People })//.populate("People")
        // console.log(data)

        let newPeopleDatas = []
        if (curpeople && curpeople.length > 0) {
            curpeople = curpeople.split(",")
            for (let i = 0; i < curpeople.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    let finalId = data[j]._id.toString()
                    // console.log(curpeople)
                    if (curpeople[i] === finalId) {
                        newPeopleDatas.push(data[j])
                    }
                }
            }
        }else{
            newPeopleDatas = [...data]
        }



        return res.status(200).send({ status: true, message: 'Person get successfully', data: newPeopleDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// METHOD : UPDATE

const updatePerson = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { teamId, fname, lname, mobile, email, workRole, mentor, mentees, tags, _id } = data;
        // console.log(req.body)
        //Input data validation
        let oldata = await personModel.findOne({ _id: _id })
        if (!oldata) {
            return res.status(400).send({ status: false, message: "Invalide people!!" })
        }
        // console.log(oldata)
        let msgUserData = isValideUpdatePerson(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        await personModel.findOneAndUpdate({ teamId: teamId, _id: _id }, data, { new: true });
        return res.status(200).send({ status: true, message: "Update successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deletePerson = async (req, res) => {
    try {
        // using destructuring of body data.
        let { personid, teamid } = req.headers
        // console.log(req.body)

        //Input data validation
        const isUnique = await personModel.findOne({ _id: personid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }


        await personModel.findOneAndDelete({ _id: personid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Person  is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { createPerson, getPerson, updatePerson, deletePerson }
const tagsModel = require("../../models/User_Model/tags_Model");
const { isValideTags } = require("../../dataValidation/inputDataValidation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();



// METHOD : CREATE

const createTags = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const { tags } = data;
        // return res.status(200).send({ status: true, message: "ok", data: req.body })

        //Input data validation
        for (let i = 0; i < tags.length; i++) {
            let msgUserData = isValideTags(tags[i])
            if (msgUserData) {
                return res.status(400).send({ status: false, message: msgUserData })
            }
        }

        //Create user data after format fname, lname, companyName
        // const userData = {
        //     tags: tags,
        // };

        // await tagsModel.create(userData)
        await tagsModel.insertMany(tags)
        return res.status(201).send({ status: true, message: "New Tags created successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getTags = async (req, res) => {
    try {
        // using destructuring of body data.
        let { userid } = req.headers


        let data = await tagsModel.find({})
        // console.log(data)
        // let arr = []
        // data.map(e=>e.tags.map(s=>{
        //     let inc = arr.includes(s)
        //     if(!inc){
        //         arr.push(s)
        //     }
        // }))
        // arr.push(data.map(e=> e.tags))

        return res.status(200).send({ status: true, message: 'Tags get successfully', data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// METHOD : DELETE

const deleteTags = async (req, res) => {
    try {
        // using destructuring of body data.
        let { tagsid, teamid } = req.headers
        // console.log(tagsid)

        //Input data validation
        const isUnique = await tagsModel.findOne({ _id: tagsid, teamId: teamid });
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "Data Not Found." })
        }

        await tagsModel.findOneAndDelete({ _id: tagsid, teamId: teamid })
        return res.status(200).send({ status: true, message: "Tags is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {createTags, getTags , deleteTags}
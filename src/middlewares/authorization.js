const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const jwt = require("jsonwebtoken");
require('dotenv').config();




//Authorization of user.

const authorization = async (req, res, next) => {
    try {
        let Id = req.Id;
        let role = req.role
        let data = req.body.adminId;
        if(!data){
            data = req.headers.adminid
        }
        // console.log(Id);
        // console.log(data);
        if (!data) {
            return res.status(400).send({ status: false, message: "please input admin id" })
        }
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "UserId is not valid" });
        }
        if (Id != data) {
            return res.status(403).send({ status: false, message: `unauthorized access` });
        }
        // console.log(Id);
        req.Role = role
        req.admin = Id
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authorization }
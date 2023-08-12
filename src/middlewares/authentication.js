const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { privateKey } = require('../Config/keys')

//Authentication of user.

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        // let token = req.body.token
        //Token present or not
        if (!token) {
            return res.status(400).send({ status: false, message: "Please enter token number." })
        }

        token = token.split(" ")[1];

        //Verify sekret key
        let decodedToken = jwt.verify(String(token), privateKey, { ignoreExpiration: true }, function (error, done) {
            if (error) {
                return res.status(401).send({ status: false, message: "Token is Invalid" });
            }
            return done;
        })

        if (decodedToken.exp < Date.now() / 1000) return res.status(401).send({ status: false, message: "Token is Expired, Please relogin" });
        req.role = decodedToken.role
        if(req.role === 'Admin'){
            req.Id = decodedToken.adminId;
        }
        else{
            req.Id = decodedToken.userId;
        }
        
        // return res.send(req.Id)
        // console.log(req.Id)
        next();

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}


//====================================================================================//
module.exports = { authentication }
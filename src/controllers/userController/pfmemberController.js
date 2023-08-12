const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");
require('dotenv').config();
const PFMember = require('../../models/User_Model/PFMembers')



const PFMemberUandC = async (req, res) => {
    try {
        let data = req.body;
        let { teamId, memberType, coreMembers, extendedMembers } = data;

        let oldData = await PFMember.findOne({ teamId: teamId, memberType: memberType })

        if (oldData) {
            await PFMember.findOneAndUpdate({teamId: teamId, memberType: memberType}, data, {new: true})
            return res.status(200).send({status: false, message: "Member update"})
        } else {
            let coreMember = {
                Skills: coreMembers.Skills ? coreMembers.Skills : [],
                Roles: coreMembers.Roles ? coreMembers.Roles : [],
                Links: coreMembers.Links ? coreMembers.Links : [],
                Domains: coreMembers.Domains ? coreMembers.Domains : [],
            }


            let extendedMember = {
                Skills: extendedMembers.Skills ? extendedMembers.Skills : [],
                Roles: extendedMembers.Roles ? extendedMembers.Roles : [],
                Links: extendedMembers.Links ? extendedMembers.Links : [],
                Domains: coreMembers.Domains ? coreMembers.Domains : [],
            }

            let memberData = {
                teamId: teamId,
                memberType: memberType,
                coreMembers: coreMember,
                extendedMembers: extendedMember
            }
            let result = await PFMember.create(memberData)
            return res.status(201).send({ status: false, message: "Member created", data: result })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const getPFMember= async (req, res) => {
    try {
        let { teamid, membertype } = req.headers;

        let data = await PFMember.find({ teamId: teamid })

        return res.status(200).send({ status: false, message: "Member get", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { PFMemberUandC, getPFMember }
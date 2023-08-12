const CandE_Members = require('../../models/User_Model/CandE_Members')
const { isValidMember, isValidUpdateMember } = require('../../dataValidation/dataValidation')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();



const createMember = async (req, res) => {
    try {
        let data = req.body;
        let { teamId, memberType, coreMembers, extendedMembers } = data;

        let oldData = await CandE_Members.findOne({ teamId: teamId, memberType: memberType })
        if (oldData) {
            return res.status(400).send({ status: false, message: 'Circle member already exists' })
        }
        
        // let memberMessage = isValidMember(data)
        // if (memberMessage) {
        //     return res.status(400).send({ status: false, message: memberMessage });
        // }

        let coreMember = {
            People: coreMembers.People ? coreMembers.People : [],
            Skills: coreMembers.Skills ? coreMembers.Skills : [],
            Roles: coreMembers.Roles ? coreMembers.Roles : [],
            Links: coreMembers.Links ? coreMembers.Links : [],
            Domains: coreMembers.Domains ? coreMembers.Domains : [],
            Circles: coreMembers.Circles ? coreMembers.Circles : [],
            Projects: coreMembers.Projects ? coreMembers.Projects : [],
        }


        let extendedMember = {
            People: extendedMembers.People ? extendedMembers.People : [],
            Skills: extendedMembers.Skills ? extendedMembers.Skills : [],
            Roles: extendedMembers.Roles ? extendedMembers.Roles : [],
            Links: extendedMembers.Links ? extendedMembers.Links : [],
        }

        let memberData = {
            teamId: teamId,
            memberType: memberType,
            coreMembers: coreMember,
            extendedMembers: extendedMember
        }


        let result = await CandE_Members.create(memberData)
        return res.status(201).send({ status: false, message: "Member created", data: result })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const getMember = async (req, res) => {
    try {
        let { teamid, membertype } = req.headers;

        let data = await CandE_Members.find({ teamId: teamid })

        return res.status(200).send({ status: false, message: "Member get", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}




const updateMember = async (req, res) => {
    try {
        let data = req.body;
        let { teamId, memberType, coreMembers, extendedMembers } = data;

        let memberMessage = isValidUpdateMember(data);
        if (memberMessage) return memberMessage

        let oldData = await CandE_Members.findOne({ teamId: teamId, memberType: memberType })
        if (!oldData) {
            return res.status(404).send({ status: false, message: "Member not found" });
        }

        await CandE_Members.findOneAndUpdate({teamId: teamId, memberType: memberType}, data, {new: true})
        return res.status(200).send({status: false, message: "Member update"})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const deleteMember = async (req, res) => {
    try {
        let { teamid, membertype } = req.headers;

        let oldData = await CandE_Members.findOne({ teamId: teamid, memberType: membertype })
        if (!oldData) {
            return res.status(404).send({ status: false, message: "Member not found" })
        }

        await CandE_Members.findOneAndDelete({ teamId: teamid, memberType: membertype })
        return res.status(200).send({ status: false, message: "Member delete" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createMember, getMember, updateMember, deleteMember }
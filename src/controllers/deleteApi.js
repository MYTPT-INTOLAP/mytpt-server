const personModel = require("../models/User_Model/Person_Model");
const skillsModel = require("../models/User_Model/Skill_Model");
const rolesModel = require("../models/User_Model/Role_Model");
const domainsModel = require("../models/User_Model/Domain_Model");
const linksModel = require("../models/User_Model/Link_Model");
const circleModel = require("../models/User_Model/Circle_Model");
const projectModel = require("../models/User_Model/Project_Model");




const deletPerson = async (req, res) => {
    try {
        let nonpfilterData = await personModel.find({})
        let nonsfilterData = await skillsModel.find({})
        let nonrfilterData = await rolesModel.find({})
        let nondfilterData = await domainsModel.find({})
        let nonlfilterData = await linksModel.find({})
        let noncfilterData = await circleModel.find({})
        let nonprfilterData = await projectModel.find({})

        let pdata = []
        if (nonpfilterData && nonpfilterData.length > 0) {
            pdata = nonpfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (pdata && pdata.length > 0) {
            for (let i = 0; i < pdata.length; i++) {
                await personModel.findByIdAndDelete({ _id: pdata[i]._id })
            }
        }


        let sdata = []
        if (nonsfilterData && nonsfilterData.length > 0) {
            sdata = nonsfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (sdata && sdata.length > 0) {
            for (let i = 0; i < sdata.length; i++) {
                await skillsModel.findByIdAndDelete({ _id: sdata[i]._id })
            }
        }


        let rdata = []
        if (nonrfilterData && nonrfilterData.length > 0) {
            rdata = nonrfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (rdata && rdata.length > 0) {
            for (let i = 0; i < rdata.length; i++) {
                await rolesModel.findByIdAndDelete({ _id: rdata[i]._id })
            }
        }


        let ddata = []
        if (nondfilterData && nondfilterData.length > 0) {
            ddata = nondfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (ddata && ddata.length > 0) {
            for (let i = 0; i < ddata.length; i++) {
                await domainsModel.findByIdAndDelete({ _id: ddata[i]._id })
            }
        }


        let ldata = []
        if (nonlfilterData && nonlfilterData.length > 0) {
            ldata = nonlfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (ldata && ldata.length > 0) {
            for (let i = 0; i < ldata.length; i++) {
                await linksModel.findByIdAndDelete({ _id: ldata[i]._id })
            }
        }



        let cdata = []
        if (noncfilterData && noncfilterData.length > 0) {
            cdata = noncfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (cdata && cdata.length > 0) {
            for (let i = 0; i < cdata.length; i++) {
                await circleModel.findByIdAndDelete({ _id: cdata[i]._id })
            }
        }


        let prdata = []
        if (nonprfilterData && nonprfilterData.length > 0) {
            prdata = nonprfilterData.filter((e) => {
                if (e.teamId) {
                    return e.teamId.toString() !== '63b81d5c32c3969f8b84a222'
                }
            })
        }
        if (prdata && prdata.length > 0) {
            for (let i = 0; i < prdata.length; i++) {
                await projectModel.findByIdAndDelete({ _id: prdata[i]._id })
            }
        }


        return res.status(200).send({ status: false, message: 'get all data' });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { deletPerson }
const mongoose = require('mongoose')
const infoModel = require("../../models/User_Model/Info_Model")
const { isValidInfo } = require('../../dataValidation/dataValidation')
require('dotenv').config();


// METHOD : CREATE

const createInfo = async (req, res) => {
    try {

        let data = req.body
        const { teamId, infoCard, infoMassage } = data;
        // console.log(teamId);

        let info = await infoModel.findOne({ teamId: teamId, infoCard: infoCard })

        let message = isValidInfo(data)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }

        if (info && Object.keys(info).length > 0) {
            await infoModel.findOneAndUpdate({ _id: info._id }, data, { new: true })
            return res.status(200).send({ status: true, message: "New Info Update successfully" });
        }
        // console.log(info);
        else {
            const infoData = {
                teamId: teamId,
                infoCard: infoCard,
                infoMassage: infoMassage
            };

            await infoModel.create(infoData)
            return res.status(201).send({ status: true, message: "New Info Create successfully" });
        }



    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getInfo = async (req, res) => {
    try {
        // using destructuring of body data.

        let data = await infoModel.find({})

        return res.status(200).send({ status: true, message: 'Info get successfully', data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




const updateInfo = async (req, res) => {
    try {
        // using destructuring of body data.
        let { infoData } = req.body
        let data = await infoModel.find({})

        let infoUpdateData = []
        if (data && data.length > 0 && infoData) {
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    _id: '',
                    infoCard: '',
                    infoMassage: ''
                }
                if (data[i].infoCard === 'People') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.People
                } else if (data[i].infoCard === 'Skills') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Skills
                } else if (data[i].infoCard === 'Roles') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Roles
                } else if (data[i].infoCard === 'Domains') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Domains
                } else if (data[i].infoCard === 'Links') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Links
                } else if (data[i].infoCard === 'Circles') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Circles
                } else if (data[i].infoCard === 'Projects') {
                    obj._id = data[i]._id
                    obj.infoCard = data[i].infoCard
                    obj.infoMassage = infoData.Projects
                }

                if(obj.infoCard && obj.infoCard.length > 0){
                    await infoModel.findOneAndUpdate({_id: obj._id},obj, {new: true})
                }
            }
        }

        return res.status(200).send({ status: true, message: 'Info update successfully' })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




// const deleteInfo = async (req, res) => {
//     try {
//         // using destructuring of body data.
//         let { infoid, teamid } = req.headers

//         const oldData = await tagsModel.findOne({ _id: infoid, teamId: teamid });
//         if (!oldData) {
//             return res.status(404).send({ status: false, message: "Data Not Found." })
//         }

//         await infoModel.findOneAndDelete({ _id: infoid, teamId: teamid })
//         return res.status(200).send({ status: true, message: "Info is Deleted" });

//     }
//      catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
//  }



module.exports = { createInfo, getInfo, updateInfo }
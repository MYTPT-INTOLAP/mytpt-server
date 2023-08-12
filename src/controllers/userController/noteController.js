const mongoose = require('mongoose')
const noteModel = require("../../models/User_Model/Note_Model")
const { isValidNote } = require('../../dataValidation/dataValidation')
require('dotenv').config();


// METHOD : CREATE

const createNote = async (req, res) => {
    try {

        let data = req.body
        const { teamId, noteCard, noteMassage } = data;
        console.log(data);

        let note = await noteModel.findOne({ teamId: teamId, noteCard: noteCard })

        let message = isValidNote(data)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }

        if (note && Object.keys(note).length > 0) {
            await noteModel.findOneAndUpdate({ _id: note._id }, data, { new: true })
            return res.status(200).send({ status: true, message: "New Note Update successfully" });
        }
     
        else {   
            const noteData = {
                teamId: teamId,
                noteCard: noteCard,
                noteMassage: noteMassage
            };
               
            console.log(noteData);
            await noteModel.create(noteData)
            return res.status(201).send({ status: true, message: "New Note Create successfully" });
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getNote = async (req, res) => {
    try {
        // using destructuring of body data.

        let data = await noteModel.find({})

        return res.status(200).send({ status: true, message: 'Note get successfully', data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createNote, getNote}

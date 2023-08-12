const teamModel = require("../models/Team_Model/Team_Model");
const { isValideTeam, isValideUpdateTeam } = require("../dataValidation/dataValidation")
const personModel = require("../models/User_Model/Person_Model");
const skillModel = require("../models/User_Model/Skill_Model");
const roleModel = require("../models/User_Model/Role_Model");
const domainModel = require("../models/User_Model/Domain_Model");
const linkModel = require("../models/User_Model/Link_Model");
const circleModel = require("../models/User_Model/Circle_Model");
const projectModel = require("../models/User_Model/Project_Model");
const meetingModel = require("../models/User_Model/meeting_Model");
const stateModel = require("../models/User_Model/States_Model");
const memberModel = require("../models/User_Model/CandE_Members");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Admin = require("../models/Admin_Model/Admin");
require('dotenv').config();
const { sendEmail } = require('../sender/emailSend')

// METHOD : CREATE

const createTeam = async (req, res) => {
    try {
        // using destructuring of body data.
        const { data, adminId } = req.body;

        // console.log(data, adminId)
        //Input data validation
        let msgUserData = isValideTeam(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //Create user data after format fname, lname, companyName
        for (let i = 0; i < data.length; i++) {
            let userData = {
                team_name: data[i].team_name.trim(),
                userId: adminId.trim()
            };
            let resData = await teamModel.create(userData);
            if (resData && Object.keys(resData).length > 0) {
                let cuNewRoles = []
                let DRoles = ['Circle Lead', 'Project Lead', 'Domain Owner', 'Link Owner', 'Mentor']
                for (let j = 0; j < DRoles.length; j++) {
                    let rObj = {
                        teamId: resData._id, roleName: DRoles[j],
                        purpose: '', tasks: [],
                        owners: [], domains: [],
                        tags: [], defaultRole: true
                    }
                    cuNewRoles.push(rObj)
                }
                if (cuNewRoles.length > 0 && cuNewRoles.length === DRoles.length) {
                    await roleModel.insertMany(cuNewRoles)
                }
                let dMeetings = {
                    teamId: resData._id,
                    meetingsName: 'Governance Meeting',
                    meetingsPurpse: '',
                    recurrence: '',
                    duration: '',
                    defaultMeeting: true
                }
                let newMeeting = await meetingModel.create(dMeetings)
                if (newMeeting && Object.keys(newMeeting).length > 0) {
                    let dCircles = {
                        teamId: resData._id,
                        circleName: 'Team Circle', defaultCircle: true,
                        purpose: '', tasks: [], lead: null, leadToDos: [],
                        meetings: [newMeeting._id], standIn: null, administration: [], tags: []
                    }
                    let cres = await circleModel.create(dCircles)
                }
                let dRole = {
                    teamId: resData._id, roleName: 'Governance moderator',
                    purpose: '', tasks: [],
                    owners: [], domains: [],
                    tags: [], defaultRole: true
                }
                let curRoles = await roleModel.create(dRole)
                if (curRoles && Object.keys(curRoles).length > 0) {
                    let dDomain = {
                        teamId: resData._id,
                        domainName: 'mytpt', defaultDomain: true,
                        purpose: '', tasks: [], owners: {type: curRoles._id, owner: null},
                        standIn: null,  tags: []
                    }
                    let resDomain = await domainModel.create(dDomain)
                    if(resDomain && Object.keys(resDomain).length > 0){
                        let uRole = {
                            domains: [{domain: resDomain._id, owner: null}]
                        }
                        await roleModel.findOneAndUpdate({_id: curRoles._id }, uRole, {new: true})
                    }
                }
            }

        }

        return res.status(201).send({ status: true, message: "New team created successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET


const getTeam = async (req, res) => {
    try {
        // using destructuring of body data.

        // req.Role = role
        const adminId = req.admin

        let data = await teamModel.find({ userId: adminId })//.select({team_name : 1})

        return res.status(200).send({ status: true, message: 'team get successfully', data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : UPDATE

const updateTeam = async (req, res) => {
    try {
        // using destructuring of body data.
        const { team_name, teamId } = req.body;
        const adminId = req.admin

        const oldata = await teamModel.findOne({ adminId: adminId, _id: teamId }).select({ team_name: 1 })
        // return res.status(400).send({ status: false, message: oldata });

        //Input data validation
        if (team_name) {
            if (oldata.team_name === team_name) {
                return res.status(400).send({ status: false, message: `team_name: ${team_name} allready exist` });
            }
        }

        let msgUserData = isValideUpdateTeam(req.body, oldata)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const newTeam = await teamModel.findOneAndUpdate({ _id: teamId }, oldata, { new: true });
        return res.status(200).send({ status: true, message: "New team update successfully", data: newTeam });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteTeam = async (req, res) => {
    try {
        // using destructuring of body data.
        let adminId = req.admin
        const { teamId } = req.body;

        // Input data validation
        const isUnique = await teamModel.findOne({ adminId: adminId, _id: teamId });
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "data not found" })
        }


        await teamModel.findOneAndDelete({ adminId: adminId, _id: teamId })
        return res.status(200).send({ status: true, message: "Team profile is Deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const createCopyTeam = async (req, res) => {
    try {
        // using destructuring of body data.
        const { adminId, teamId } = req.body;

        let copyTeam = await teamModel.findOne({ _id: teamId });
        let copyPeople = await personModel.find({ teamId: teamId });
        let copySkill = await skillModel.find({ teamId: teamId });
        let copyRole = await roleModel.find({ teamId: teamId });
        let copyDomain = await domainModel.find({ teamId: teamId });
        let copyLink = await linkModel.find({ teamId: teamId });
        let copyCircle = await circleModel.find({ teamId: teamId });
        let copyProject = await projectModel.find({ teamId: teamId });
        let copyMeeting = await meetingModel.find({ teamId: teamId });
        let copyState = await stateModel.findOne({ teamId: teamId });
        let copyMember = await memberModel.find({ teamId: teamId });

        // console.log(copyMember);


        //Create
        let newTeam = {}
        if (copyTeam && copyTeam.team_name.length > 0) {
            let teamName = copyTeam.team_name + ' ' + "(copy)"
            newTeam = await teamModel.create({ team_name: teamName, userId: adminId })
            newTeam.oldTeamId = copyTeam._id
        }

        let newPeople = []
        if (copyPeople && copyPeople.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyPeople.length; i++) {
                let newPersonData = {
                    oldId: copyPeople[i]._id,
                    teamId: newTeam._id,
                    fname: copyPeople[i].fname,
                    lname: copyPeople[i].lname ? copyPeople[i].lname : '',
                    mobile: copyPeople[i].mobile ? copyPeople[i].mobile : '',
                    email: copyPeople[i].email ? copyPeople[i].email : '',
                    workRole: copyPeople[i].workRole ? copyPeople[i].workRole : "Internal",
                    mentor: copyPeople[i].mentor ? copyPeople[i].mentor : null,
                    mentees: copyPeople[i].mentees.length > 0 ? copyPeople[i].mentees : [],
                    tags: copyPeople[i].tags.length > 0 ? copyPeople[i].tags : [],
                }
                let response = await personModel.create(newPersonData)
                newPersonData._id = response._id
                newPeople.push(newPersonData);
            }
        }

        let newSkill = []
        if (copySkill && copySkill.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copySkill.length; i++) {
                let skillData = {
                    oldId: copySkill[i]._id,
                    teamId: newTeam._id,
                    skillName: copySkill[i].skillName,
                    purpose: copySkill[i].purpose ? copySkill[i].purpose : '',
                    tasks: copySkill[i].tasks ? copySkill[i].tasks : '',
                    ownerType: copySkill[i].ownerType ? copySkill[i].ownerType : "Single owner",
                    owners: copySkill[i].owners.length > 0 ? copySkill[i].owners : [],
                    domains: copySkill[i].domains ? copySkill[i].domains : [],
                    memberIn: copySkill[i].memberIn ? copySkill[i].memberIn : [],
                    tags: copySkill[i].tags.length > 0 ? copySkill[i].tags : []
                }
                let response = await skillModel.create(skillData)
                skillData._id = response._id
                newSkill.push(skillData);
            }
        }

        let newRole = []
        if (copyRole && copyRole.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyRole.length; i++) {
                let roleData = {
                    oldId: copyRole[i]._id,
                    teamId: newTeam._id,
                    roleName: copyRole[i].roleName,
                    purpose: copyRole[i].purpose ? copyRole[i].purpose : '',
                    tasks: copyRole[i].tasks ? copyRole[i].tasks : '',
                    ownerRole: copyRole[i].ownerRole ? copyRole[i].ownerRole : "Single owner",
                    owners: copyRole[i].owners.length > 0 ? copyRole[i].owners : [],
                    domains: copyRole[i].domains ? copyRole[i].domains : [],
                    memberIn: copyRole[i].memberIn ? copyRole[i].memberIn : [],
                    tags: copyRole[i].tags.length > 0 ? copyRole[i].tags : []
                }
                let response = await roleModel.create(roleData)
                roleData._id = response._id
                newRole.push(roleData);
            }
        }

        let newDomain = []
        if (copyDomain && copyDomain.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyDomain.length; i++) {
                let domainData = {
                    oldId: copyDomain[i]._id,
                    teamId: newTeam._id,
                    domainName: copyDomain[i].domainName,
                    purpose: copyDomain[i].purpose ? copyDomain[i].purpose : '',
                    tasks: copyDomain[i].tasks ? copyDomain[i].tasks : '',
                    owners: copyDomain[i].owners ? copyDomain[i].owners : '',
                    standIn: copyDomain[i].standIn ? copyDomain[i].standIn : null,
                    memberIn: copyDomain[i].memberIn ? copyDomain[i].memberIn : [],
                    tags: copyDomain[i].tags.length > 0 ? copyDomain[i].tags : []
                }
                let response = await domainModel.create(domainData)
                domainData._id = response._id
                newDomain.push(domainData);
            }
        }

        let newLink = []
        if (copyLink && copyLink.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyLink.length; i++) {
                let LinkData = {
                    oldId: copyLink[i]._id,
                    teamId: newTeam._id,
                    domainName: copyLink[i].domainName,
                    purpose: copyLink[i].purpose ? copyLink[i].purpose : '',
                    tasks: copyLink[i].tasks ? copyLink[i].tasks : '',
                    owner: copyLink[i].owner ? copyLink[i].owner : null,
                    standIn: copyLink[i].standIn ? copyLink[i].standIn : null,
                    memberIn: copyLink[i].memberIn ? copyLink[i].memberIn : [],
                    tags: copyLink[i].tags.length > 0 ? copyLink[i].tags : []
                }
                let response = await linkModel.create(LinkData)
                LinkData._id = response._id
                newLink.push(LinkData);
            }
        }

        let newCircle = []
        if (copyCircle && copyCircle.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyCircle.length; i++) {
                let circleData = {
                    oldId: copyCircle[i]._id,
                    teamId: newTeam._id,
                    circleName: copyCircle[i].circleName,
                    purpose: copyCircle[i].purpose ? copyCircle[i].purpose : '',
                    tasks: copyCircle[i].tasks ? copyCircle[i].tasks : '',
                    lead: copyCircle[i].lead ? copyCircle[i].lead : null,
                    standIn: copyCircle[i].standIn ? copyCircle[i].standIn : null,
                    administration: copyCircle[i].administration ? copyCircle[i].administration : [],
                    leadToDos: copyCircle[i].leadToDos ? copyCircle[i].leadToDos : [],
                    tags: copyCircle[i].tags.length > 0 ? copyCircle[i].tags : [],
                    meetings: copyCircle[i].meetings ? copyCircle[i].meetings : ''

                }
                let response = await circleModel.create(circleData)
                circleData._id = response._id
                newCircle.push(circleData);
            }
        }

        let newProject = []
        if (copyProject && copyProject.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyProject.length; i++) {
                let projectData = {
                    oldId: copyProject[i]._id,
                    teamId: newTeam._id,
                    projectName: copyProject[i].projectName,
                    purpose: copyProject[i].purpose ? copyProject[i].purpose : '',
                    tasks: copyProject[i].tasks ? copyProject[i].tasks : [],
                    lead: copyProject[i].lead ? copyProject[i].lead : null,
                    standIn: copyProject[i].standIn ? copyProject[i].standIn : null,
                    administration: copyProject[i].administration ? copyProject[i].administration : [],
                    leadToDos: copyProject[i].leadToDos ? copyProject[i].leadToDos : [],
                    tags: copyProject[i].tags.length > 0 ? copyProject[i].tags : [],
                    meetings: copyProject[i].meetings ? copyProject[i].meetings : []
                }
                let response = await projectModel.create(projectData)
                projectData._id = response._id
                newProject.push(projectData);
            }
        }

        let newMeeting = []
        if (copyMeeting && copyMeeting.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyMeeting.length; i++) {
                let meetingData = {
                    oldId: copyMeeting[i]._id,
                    teamId: newTeam._id,
                    meetingsName: copyMeeting[i].meetingsName,
                    meetingsPurpse: copyMeeting[i].meetingsPurpse ? copyMeeting[i].meetingsPurpse : '',
                    recurrence: copyMeeting[i].recurrence ? copyMeeting[i].recurrence : '',
                    duration: copyMeeting[i].duration ? copyMeeting[i].duration : '',
                    durationType: copyMeeting[i].durationType ? copyMeeting[i].durationType : '',
                    recurrenceType: copyMeeting[i].recurrenceType ? copyMeeting[i].recurrenceType : '',
                    XTD: copyMeeting[i].XTD ? copyMeeting[i].XTD : false
                }
                let response = await meetingModel.create(meetingData)
                meetingData._id = response._id
                newMeeting.push(meetingData);
            }
        }

        let newState = []
        if (copyState && Object.keys(copyState).length > 0 && Object.keys(newTeam).length > 0) {
            let newData = {
                oldId: copyState._id,
                teamId: newTeam._id,
                Person: [],
                Skills: [],
                Roles: [],
                Domains: [],
                Links: [],
                Circles: [],
                Projects: [],
                TeamLists: [...copyState.TeamLists]
            }
            if (newPeople && newPeople.length > 0) {
                for (var i = 0; i < copyState.Person.length; i++) {
                    for (var j = 0; j < newPeople.length; j++) {
                        if (copyState.Person[i].toString() == newPeople[j].oldId.toString()) {
                            newData.Person = [...new Set([...newData.Person, newPeople[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newSkill && newSkill.length > 0) {
                for (var i = 0; i < copyState.Skills.length; i++) {
                    for (var j = 0; j < newSkill.length; j++) {
                        if (copyState.Skills[i].toString() == newSkill[j].oldId.toString()) {
                            newData.Skills = [... new Set([...newData.Skills, newSkill[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newRole && newRole.length > 0) {
                for (var i = 0; i < copyState.Roles.length; i++) {
                    for (var j = 0; j < newRole.length; j++) {
                        if (copyState.Roles[i].toString() == newRole[j].oldId.toString()) {
                            newData.Roles = [... new Set([...newData.Roles, newRole[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newDomain && newDomain.length > 0) {
                for (var i = 0; i < copyState.Domains.length; i++) {
                    for (var j = 0; j < newDomain.length; j++) {
                        if (copyState.Domains[i].toString() == newDomain[j].oldId.toString()) {
                            newData.Domains = [... new Set([...newData.Domains, newDomain[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newLink && newLink.length > 0) {
                for (var i = 0; i < copyState.Links.length; i++) {
                    for (var j = 0; j < newLink.length; j++) {
                        if (copyState.Links[i].toString() == newLink[j].oldId.toString()) {
                            newData.Links = [... new Set([...newData.Links, newLink[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newCircle && newCircle.length > 0) {
                for (var i = 0; i < copyState.Circles.length; i++) {
                    for (var j = 0; j < newCircle.length; j++) {
                        if (copyState.Circles[i].toString() == newCircle[j].oldId.toString()) {
                            newData.Circles = [... new Set([...newData.Circles, newCircle[j]._id.toString()])]
                        }
                    }
                }
            }
            if (newProject && newProject.length > 0) {
                for (var i = 0; i < copyState.Projects.length; i++) {
                    for (var j = 0; j < newProject.length; j++) {
                        if (copyState.Projects[i].toString() == newProject[j].oldId.toString()) {
                            newData.Projects = [... new Set([...newData.Projects, newProject[j]._id.toString()])]
                        }
                    }
                }
            }
            let response = await stateModel.create(newData)
            newState.push(response);
        }


        let newMember = []
        if (copyMember && copyMember.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < copyMember.length; i++) {
                let newMemberData = {
                    memberType: "",
                    oldId: copyMember[i]._id,
                    teamId: newTeam._id,
                    coreMembers: {
                        People: [],
                        Skills: [],
                        Roles: [],
                        Domains: [],
                        Links: [],
                        Circles: [],
                        Projects: [],
                    },
                    extendedMembers: {
                        People: [],
                        Skills: [],
                        Roles: [],
                        Links: [],
                        Domains: [],
                        Circles: []
                    }
                }
                if (copyMember[i].memberType && copyMember[i].memberType.toString().length > 0 && newCircle && newCircle.length > 0 && newProject && newProject.length > 0) {
                    for (var j = 0; j < newCircle.length; j++) {
                        if (copyMember[i].memberType.toString() === newCircle[j].oldId.toString()) {
                            newMemberData.memberType = newCircle[j]._id.toString()
                        }
                    }
                    for (var k = 0; k < newProject.length; k++) {
                        if (copyMember[i].memberType.toString() === newProject[k].oldId.toString()) {
                            newMemberData.memberType = newProject[k]._id.toString()
                        }
                    }
                }
                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.People && copyMember[i].coreMembers.People.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.People && copyMember[i].extendedMembers.People.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.People && copyMember[i].coreMembers.People.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.People.length; t++) {
                            for (var k = 0; k < newPeople.length; k++) {
                                if (copyMember[i].coreMembers.People[t].toString() == newPeople[k].oldId.toString()) {
                                    newMemberData.coreMembers.People = [...new Set([...newMemberData.coreMembers.People, newPeople[k]._id.toString()])]
                                }
                            }
                        }
                    }
                    if (copyMember[i].extendedMembers && copyMember[i].extendedMembers.People && copyMember[i].extendedMembers.People.length > 0) {
                        for (var t = 0; t < copyMember[i].extendedMembers.People.length; t++) {
                            for (var k = 0; k < newPeople.length; k++) {
                                if (copyMember[i].extendedMembers.People[t].toString() == newPeople[k].oldId.toString()) {
                                    newMemberData.extendedMembers.People = [...new Set([...newMemberData.extendedMembers.People, newPeople[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }
                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Skills && copyMember[i].coreMembers.Skills.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Skills && copyMember[i].extendedMembers.Skills.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Skills && copyMember[i].coreMembers.Skills.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Skills.length; t++) {
                            for (var k = 0; k < newSkill.length; k++) {
                                if (copyMember[i].coreMembers.Skills[t].toString() == newSkill[k].oldId.toString()) {
                                    newMemberData.coreMembers.Skills = [...new Set([...newMemberData.coreMembers.Skills, newSkill[k]._id.toString()])]
                                }
                            }
                        }
                    }
                    if (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Skills && copyMember[i].extendedMembers.Skills.length > 0) {
                        for (var t = 0; t < copyMember[i].extendedMembers.Skills.length; t++) {
                            for (var k = 0; k < newSkill.length; k++) {
                                if (copyMember[i].extendedMembers.Skills[t].toString() == newSkill[k].oldId.toString()) {
                                    newMemberData.extendedMembers.Skills = [...new Set([...newMemberData.extendedMembers.Skills, newSkill[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Roles && copyMember[i].coreMembers.Roles.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Roles && copyMember[i].extendedMembers.Roles.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Roles && copyMember[i].coreMembers.Roles.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Roles.length; t++) {
                            for (var k = 0; k < newRole.length; k++) {
                                if (copyMember[i].coreMembers.Roles[t].toString() == newRole[k].oldId.toString()) {
                                    newMemberData.coreMembers.Roles = [...new Set([...newMemberData.coreMembers.Roles, newRole[k]._id.toString()])]
                                }
                            }
                        }
                    }
                    if (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Roles && copyMember[i].extendedMembers.Roles.length > 0) {
                        for (var t = 0; t < copyMember[i].extendedMembers.Roles.length; t++) {
                            for (var k = 0; k < newRole.length; k++) {
                                if (copyMember[i].extendedMembers.Roles[t].toString() == newRole[k].oldId.toString()) {
                                    newMemberData.extendedMembers.Roles = [...new Set([...newMemberData.extendedMembers.Roles, newRole[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Domains && copyMember[i].coreMembers.Domains.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Domains && copyMember[i].extendedMembers.Domains.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Domains && copyMember[i].coreMembers.Domains.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Domains.length; t++) {
                            for (var k = 0; k < newDomain.length; k++) {
                                if (copyMember[i].coreMembers.Domains[t].toString() == newDomain[k].oldId.toString()) {
                                    newMemberData.coreMembers.Domains = [...new Set([...newMemberData.coreMembers.Domains, newDomain[k]._id.toString()])]
                                }
                            }
                        }
                    }
                    if (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Domains && copyMember[i].extendedMembers.Domains.length > 0) {
                        for (var t = 0; t < copyMember[i].extendedMembers.Domains.length; t++) {
                            for (var k = 0; k < newDomain.length; k++) {
                                if (copyMember[i].extendedMembers.Domains[t].toString() == newDomain[k].oldId.toString()) {
                                    newMemberData.extendedMembers.Domains = [...new Set([...newMemberData.extendedMembers.Domains, newDomain[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Links && copyMember[i].coreMembers.Links.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Links && copyMember[i].extendedMembers.Links.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Links && copyMember[i].coreMembers.Links.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Links.length; t++) {
                            for (var k = 0; k < newLink.length; k++) {
                                if (copyMember[i].coreMembers.Links[t].toString() == newLink[k].oldId.toString()) {
                                    newMemberData.coreMembers.Links = [...new Set([...newMemberData.coreMembers.Links, newLink[k]._id.toString()])]
                                }
                            }
                        }
                    }
                    if (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Links && copyMember[i].extendedMembers.Links.length > 0) {
                        for (var t = 0; t < copyMember[i].extendedMembers.Links.length; t++) {
                            for (var k = 0; k < newLink.length; k++) {
                                if (copyMember[i].extendedMembers.Links[t].toString() == newLink[k].oldId.toString()) {
                                    newMemberData.extendedMembers.Links = [...new Set([...newMemberData.extendedMembers.Links, newLink[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Circles && copyMember[i].coreMembers.Circles.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Circles && copyMember[i].extendedMembers.Circles.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Circles && copyMember[i].coreMembers.Circles.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Circles.length; t++) {
                            for (var k = 0; k < newCircle.length; k++) {
                                if (copyMember[i].coreMembers.Circles[t].toString() == newCircle[k].oldId.toString()) {
                                    newMemberData.coreMembers.Circles = [...new Set([...newMemberData.coreMembers.Circles, newCircle[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if ((copyMember[i].coreMembers && copyMember[i].coreMembers.Projects && copyMember[i].coreMembers.Projects.length > 0) || (copyMember[i].extendedMembers && copyMember[i].extendedMembers.Projects && copyMember[i].extendedMembers.Projects.length > 0)) {
                    if (copyMember[i].coreMembers && copyMember[i].coreMembers.Projects && copyMember[i].coreMembers.Projects.length > 0) {
                        for (var t = 0; t < copyMember[i].coreMembers.Projects.length; t++) {
                            for (var k = 0; k < newProject.length; k++) {
                                if (copyMember[i].coreMembers.Projects[t].toString() == newProject[k].oldId.toString()) {
                                    newMemberData.coreMembers.Projects = [...new Set([...newMemberData.coreMembers.Projects, newProject[k]._id.toString()])]
                                }
                            }
                        }
                    }
                }

                if (Object.keys(newMemberData).length > 0 && newMemberData.memberType && newMemberData.memberType.length > 0
                    && newPeople && newPeople.length > 0 && newSkill && newSkill.length > 0 && newRole && newRole.length > 0
                    && newDomain && newDomain.length > 0 && newLink && newLink.length > 0 && newCircle && newCircle.length > 0) {
                    newMember.push(newMemberData)
                }
            }
        }


        if(copyMember.length > 0 && newMember.length > 0){
            let data = await memberModel.insertMany(newMember)
        }


        //Update

        if (newPeople && newPeople.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newPeople.length; i++) {
                let changePersonM = newPeople[i]
                for (let j = 0; j < newPeople.length; j++) {
                    if (newPeople[i].mentor && newPeople[j].oldId) {
                        if (newPeople[i].mentor.toString() === newPeople[j].oldId.toString()) {
                            changePersonM.mentor = newPeople[j]._id
                        }
                    }
                }

                if (newPeople[i].mentees.length > 0) {
                    let curmentess = []
                    for (let l = 0; l < newPeople[i].mentees.length; l++) {
                        for (k = 0; k < newPeople.length; k++) {
                            if (newPeople[k].oldId.toString() === newPeople[i].mentees[l].toString()) {
                                curmentess.push(newPeople[k]._id)
                            }
                        }
                    }
                    // console.log(curmentess);
                    changePersonM.mentees = curmentess
                }

                // upchangePersonM.push(changePersonM)
                let response = await personModel.findOneAndUpdate({ _id: newPeople[i]._id }, changePersonM, { new: true })
                // console.log(response)
                // break;
            }
        }


        if (newSkill && newSkill.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newSkill.length; i++) {
                let changeOwner = {}
                if (newSkill[i].owners && newSkill[i].owners.toString().length > 0) {
                    let curOwner = []
                    for (k = 0; k < newPeople.length; k++) {
                        let inc = newSkill[i].owners.includes(newPeople[k].oldId)
                        if (inc) {
                            curOwner.push(newPeople[k]._id.toString())
                        }
                    }
                    if (curOwner.length > 0) {
                        changeOwner.owners = curOwner
                    }

                }
                if (newSkill[i].domains && newSkill[i].domains.length > 0) {
                    let cuDomain = []
                    for (j = 0; j < newSkill[i].domains.length; j++) {
                        let cuDomains = {}
                        if (newSkill[i].domains[j].domain && newSkill[i].domains[j].domain.toString().length > 0) {
                            for (let k = 0; k < newDomain.length; k++) {
                                if (newSkill[i].domains[j].domain.toString() === newDomain[k].oldId.toString()) {
                                    cuDomains.domain = newDomain[k]._id.toString()
                                }
                            }
                        }
                        if (newSkill[i].domains[j].owner && newSkill[i].domains[j].owner.toString().length > 0) {
                            for (let k = 0; k < newPeople.length; k++) {
                                if (newSkill[i].domains[j].owner.toString() === newPeople[k].oldId.toString()) {
                                    cuDomains.owner = newPeople[k]._id.toString()
                                }
                            }
                        }
                        if (cuDomains && ((cuDomains.domain && cuDomains.domain.length > 0) || (cuDomains.owner && cuDomains.owner.length > 0))) {
                            cuDomain.push(cuDomains)
                        }
                    }
                    changeOwner.domains = cuDomain
                }
                // console.log(changeOwner)
                // await skillModel.findOneAndUpdate({ _id: newSkill[i]._id }, changeOwner, { new: true })
            }
        }


        if (newRole && newRole.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newRole.length; i++) {
                let changeOwner = {}
                if (newRole[i].owners && newRole[i].owners.length > 0) {
                    let curOwner = []
                    for (k = 0; k < newPeople.length; k++) {
                        let inc = newRole[i].owners.includes(newPeople[k].oldId)
                        if (inc) {
                            curOwner.push(newPeople[k]._id.toString())
                        }
                    }
                    changeOwner.owners = curOwner
                }
                if (newRole[i].domains && newRole[i].domains.length > 0) {
                    let cuDomain = []
                    for (j = 0; j < newRole[i].domains.length; j++) {
                        let cuDomains = {}
                        if (newRole[i].domains[j].domain && newRole[i].domains[j].domain.toString().length > 0) {
                            for (let k = 0; k < newDomain.length; k++) {
                                if (newRole[i].domains[j].domain.toString() === newDomain[k].oldId.toString()) {
                                    cuDomains.domain = newDomain[k]._id.toString()
                                }
                            }
                        }
                        if (newRole[i].domains[j].owner && newRole[i].domains[j].owner.toString().length > 0) {
                            for (let k = 0; k < newPeople.length; k++) {
                                if (newRole[i].domains[j].owner.toString() === newPeople[k].oldId.toString()) {
                                    cuDomains.owner = newPeople[k]._id.toString()
                                }
                            }
                        }
                        if (cuDomains && cuDomains.domain && cuDomains.domain.length > 0 && cuDomains.owner.toString().length > 0) {
                            cuDomain.push(cuDomains)
                        }
                    }
                    changeOwner.domains = cuDomain
                }
                if (Object.keys(changeOwner).length > 0) {
                    await roleModel.findOneAndUpdate({ _id: newRole[i]._id }, changeOwner, { new: true })
                }
            }
        }

        if (newDomain && newDomain.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newDomain.length; i++) {
                let changeOwner = {}
                if (Object.keys(newDomain[i].owners).length > 0) {
                    let cuOwners = {}
                    if (newDomain[i].owners.type && newDomain[i].owners.type.toString().length > 0) {
                        if (Object.keys(cuOwners).length === 0) {
                            for (let k = 0; k < newPeople.length; k++) {
                                if (newDomain[i].owners.type.toString() === newPeople[k].oldId.toString()) {
                                    cuOwners.type = newPeople[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuOwners).length === 0) {
                            for (let k = 0; k < newSkill.length; k++) {
                                if (newDomain[i].owners.type.toString() === newSkill[k].oldId.toString()) {
                                    cuOwners.type = newSkill[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuOwners).length === 0) {
                            for (let k = 0; k < newRole.length; k++) {
                                if (newDomain[i].owners.type.toString() === newRole[k].oldId.toString()) {
                                    cuOwners.type = newRole[k]._id.toString()
                                    break
                                }
                            }
                        }
                    }
                    if (newDomain[i].owners.owner && newDomain[i].owners.owner.toString().length > 0) {
                        for (let k = 0; k < newPeople.length; k++) {
                            if (newDomain[i].owners.owner.toString() === newPeople[k].oldId.toString()) {
                                cuOwners.owner = newPeople[k]._id.toString()
                            }
                        }
                    }
                    if (Object.keys(cuOwners).length > 0 && ((cuOwners.type && cuOwners.type.length > 0) || (cuOwners.owner && cuOwners.owner.length > 0))) {
                        changeOwner.owners = cuOwners
                    }
                }
                if (newDomain[i].standIn && newDomain[i].standIn.length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newDomain[i].standIn.toString() === newPeople[l].oldId.toString()) {
                            changeOwner.standIn = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (Object.keys(changeOwner).length > 0) {
                    await domainModel.findOneAndUpdate({ _id: newDomain[i]._id }, changeOwner, { new: true })
                }
            }
        }


        if (newLink && newLink.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newLink.length; i++) {
                let changeLink = {}
                if (newLink[i].owner && newLink[i].owner.toString().length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newLink[i].owner.toString() === newPeople[l].oldId.toString()) {
                            changeLink.owner = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (newLink[i].standIn && newLink[i].standIn.toString().length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newLink[i].standIn.toString() === newPeople[l].oldId.toString()) {
                            changeLink.standIn = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (Object.keys(changeLink).length > 0) {
                    await linkModel.findOneAndUpdate({ _id: newLink[i]._id.toString() }, changeLink, { new: true })
                }
            }
        }


        if (newCircle && newCircle.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newCircle.length; i++) {
                let changeCircle = {}
                if (newCircle[i].lead) {
                    let cuLead = {}
                    if (newCircle[i].lead && newCircle[i].lead.toString().length > 0) {
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newPeople.length; k++) {
                                if (newCircle[i].lead.toString() === newPeople[k].oldId.toString()) {
                                    cuLead.lead = newPeople[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newSkill.length; k++) {
                                if (newCircle[i].lead.toString() === newSkill[k].oldId.toString()) {
                                    cuLead.lead = newSkill[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newRole.length; k++) {
                                if (newCircle[i].lead.toString() === newRole[k].oldId.toString()) {
                                    cuLead.lead = newRole[k]._id.toString()
                                    break
                                }
                            }
                        }
                    }
                    if (Object.keys(cuLead).length > 0) {
                        changeCircle.lead = cuLead.lead
                    }
                }
                if (newCircle[i].standIn && newCircle[i].standIn.toString().length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newCircle[i].standIn.toString() === newPeople[l].oldId.toString()) {
                            changeCircle.standIn = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (newCircle[i].administration.owner && newCircle[i].administration.owner.toString().length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newCircle[i].administration.owner.toString() === newPeople[l].oldId.toString()) {
                            changeCircle.administration.owner = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (newCircle[i].meetings.length > 0) {
                    let curMeetings = []
                    for (k = 0; k < newMeeting.length; k++) {
                        let inc = newCircle[i].meetings.includes(newMeeting[k].oldId)
                        if (inc) {
                            curMeetings.push(newMeeting[k]._id.toString())
                        }
                    }
                    changeCircle.meetings = curMeetings
                }
                if (Object.keys(changeCircle).length > 0) {
                    await circleModel.findOneAndUpdate({ _id: newCircle[i]._id.toString() }, changeCircle, { new: true })
                }
            }
        }


        if (newProject && newProject.length > 0 && Object.keys(newTeam).length > 0) {
            for (let i = 0; i < newProject.length; i++) {
                let changeProject = {}
                if (newProject[i].lead) {
                    let cuLead = {}
                    if (newProject[i].lead && newProject[i].lead.toString().length > 0) {
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newPeople.length; k++) {
                                if (newProject[i].lead.toString() === newPeople[k].oldId.toString()) {
                                    cuLead.lead = newPeople[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newSkill.length; k++) {
                                if (newProject[i].lead.toString() === newSkill[k].oldId.toString()) {
                                    cuLead.lead = newSkill[k]._id.toString()
                                    break
                                }
                            }
                        }
                        if (Object.keys(cuLead).length === 0) {
                            for (let k = 0; k < newRole.length; k++) {
                                if (newProject[i].lead.toString() === newRole[k].oldId.toString()) {
                                    cuLead.lead = newRole[k]._id.toString()
                                    break
                                }
                            }
                        }
                    }
                    if (Object.keys(cuLead).length > 0) {
                        changeProject.lead = cuLead.lead
                    }
                }
                if (newProject[i].standIn && newProject[i].standIn.toString().length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newProject[i].standIn.toString() === newPeople[l].oldId.toString()) {
                            changeProject.standIn = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (newProject[i].administration.owner && newProject[i].administration.owner.length > 0) {
                    for (let l = 0; l < newPeople.length; l++) {
                        if (newProject[i].administration.owner.toString() === newPeople[l].oldId.toString()) {
                            changeProject.administration.owner = newPeople[l]._id.toString()
                            break
                        }
                    }
                }
                if (newProject[i].meetings.length > 0) {
                    let curMeetings = []
                    for (k = 0; k < newMeeting.length; k++) {
                        let inc = newProject[i].meetings.includes(newMeeting[k].oldId)
                        if (inc) {
                            curMeetings.push(newMeeting[k]._id.toString())
                        }
                    }
                    if (curMeetings && curMeetings.length > 0) {
                        changeProject.meetings = curMeetings
                    }
                }
                if (Object.keys(changeProject).length > 0) {
                    await circleModel.findOneAndUpdate({ _id: newProject[i]._id.toString() }, changeProject, { new: true })
                }
            }
        }

        return res.status(201).send({ status: true, message: "New Copy team created successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const createTransferTeam = async (req, res) => {

    const { teamId, adminId, emailId } = req.body;

    let data = await Admin.findOne({ email: emailId })
    if (!data) {
        return res.status(404).send({ status: false, message: 'DAta Not Found' })
    }

    let findTeam = await teamModel.findOne({ _id: teamId })
    if (!findTeam) {
        return res.status(404).send({ status: false, message: 'Data Not Found...' })
    }

    let newTeam = {
        team_name: findTeam.team_name,
        archived: findTeam.archived,
        userId: data._id
    }

    // console.log(newTeam);

    let tteam = await teamModel.findOneAndUpdate({ _id: findTeam._id }, newTeam, { new: true });
    await sendEmail(emailId, `Transfer ${findTeam.team_name} For This ${emailId}`, "Team Transfer Successfully Done... Please Check your Your Email, And Get Back To Me");

    return res.status(200).send({ status: true, message: 'Team Transfer Successfully' })
}




module.exports = { createTeam, getTeam, updateTeam, deleteTeam, createCopyTeam, createTransferTeam}
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const reportModel = require("../../models/User_Model/report_Model");
const personModel = require("../../models/User_Model/Person_Model");
const skillModel = require("../../models/User_Model/Skill_Model");
const roleModel = require("../../models/User_Model/Role_Model");
const domainModel = require("../../models/User_Model/Domain_Model");
const linkModel = require("../../models/User_Model/Link_Model");
const teamModel = require("../../models/Team_Model/Team_Model");
const adminModel = require("../../models/Admin_Model/Admin");
const circleModel = require("../../models/User_Model/Circle_Model");
const projectModel = require("../../models/User_Model/Project_Model");
const memberModel = require("../../models/User_Model/CandE_Members");
const meetingModel = require("../../models/User_Model/meeting_Model");
const crypto = require("crypto");
const { sendEmail } = require('../../sender/emailSend')
const { privateKey, BASE_URL } = require('../../Config/keys')


// METHOD : CREATE REport Request Email....

const createRequestReport = async (req, res) => {
    try {
        const { email } = req.body;
        let data = await personModel.find({ email: email });
        let links = ""
        if (data.length === 0) {
            return res.status(404).send({ status: false, message: "Data not found" });
        }

        let newData = []
        if (data.length > 0) {
            let linkData = []
            for (let i = 0; i < data.length; i++) {
                let isExist = await reportModel.findOne({ peopleId: data[i]._id })
                if (isExist) {
                    const link = `${BASE_URL}/my-report/${isExist.secreatKey}`
                    links = links + " " + link
                } else {
                    linkData.push(data[i])
                }
            }
            if (linkData.length > 0) {
                newData = [...linkData]
            }
        }

        let crReport = []
        if (newData.length > 0) {
            for (let i = 0; i < newData.length; i++) {
                let cuAdmin = await adminModel.findOne({ curTeam: newData[i].teamId });
                console.log(newData[0])
                crReport.push({
                    fname: cuAdmin.fname,
                    lname: cuAdmin.lname,
                    companyName: cuAdmin.companyName,
                    email: cuAdmin.email,
                    userId: cuAdmin._id,
                    peopleId: newData[i]._id,
                    teamId: newData[i].teamId
                })
                // console.log(crReport)
            }
        }
        // console.log(crReport)
        // Create json wab token
        let reportTokens = []
        if (crReport.length > 0) {
            for (var i = 0; i < crReport.length; i++) {
                let token = jwt.sign(crReport[i], privateKey, { expiresIn: "165265358525354825384h" });
                let secreatKey = crypto.randomBytes(10).toString("hex");
                reportTokens.push({
                    peopleId: crReport[i].peopleId,
                    secreatKey: secreatKey,
                    tokenId: token,
                    teamId: crReport[i].teamId
                });
            }
        }
        // console.log("79")

        // console.log(reportTokens);

        let newReport = await reportModel.insertMany(reportTokens)

        if (newReport && newReport.length > 0) {
            for (let i = 0; i < newReport.length; i++) {
                const link = `${process.env.BASE_URL}/my-report/${newReport[i].secreatKey}`
                links = links + " " + link
            }
        }

        let body = `
        <p>Hello ${data.fname} ${data.lname} , </p>
        <p>You have requested your personal report on teamdecoder.com</p>
         <p>
         <spam>Company Name :</spam>
         </p>
         <p>Best regards, </p>
         <p>TeamDecoder.</p>
         <p> <a> Need help?</a> </p>
         <p> <a>About teamdecoder. </a> </p>
        `

        await sendEmail(email, "Teamdecoder report", links);
        return res.status(200).send({ status: true, message: "Massage send successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const reportGetByAdmin = async (req, res) => {
    try {
        let { peopleId } = req.body;

        let isExist = await reportModel.findOne({ peopleId: peopleId })

        if (isExist) {
            let link = `${BASE_URL}/my-report/${isExist.secreatKey}`
            return res.status(200).send({ status: true, message: " People report ", data: link });
        }

        let data = await personModel.findOne({ _id: peopleId });

        if (data.length === 0) {
            return res.status(404).send({ status: false, message: "Data not found" });
        }

        let cuAdmin = await adminModel.findOne({ curTeam: data.teamId });

        let cuTokenData = {
            fname: cuAdmin.fname,
            lname: cuAdmin.lname,
            companyName: cuAdmin.companyName,
            email: cuAdmin.email,
            userId: cuAdmin._id,
            peopleId: data._id,
            teamId: data.teamId
        }
        let token = jwt.sign(cuTokenData, privateKey, { expiresIn: "165265358525354825384h" });
        let secreatKey = crypto.randomBytes(10).toString("hex");
        let curData = {
            peopleId: cuTokenData.peopleId,
            secreatKey: secreatKey,
            tokenId: token,
            teamId: cuTokenData.teamId
        }

        let newReport = await reportModel.create(curData)

        const link = `${BASE_URL}/my-report/${newReport.secreatKey}`
        return res.status(200).send({ status: true, message: "Massage send successfully", data: link })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const reportReAccept = async (req, res) => {
    try {
        let data = req.body
        const { secreatKey } = data
        // console.log(secreatKey);

        let reportData = await reportModel.findOne({ secreatKey: secreatKey })
        // console.log(reportData);
        if (!reportData) {
            return res.status(404).send({ status: false, message: " Invalid SecreatKey " });
        }

        // console.log(reportData);

        return res.status(200).send({ status: true, message: " SecreatKey Get successfully", data: reportData });



    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getTeamReport = async (req, res) => {
    try {

        // using destructuring of body data.
        let teamId = req.headers.teamid
        let data = await teamModel.findOne({ _id: teamId })
        //  console.log(data);
        return res.status(200).send({ status: true, message: "Report Team Get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getPeopleReport = async (req, res) => {
    try {

        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid

        let peopleData = await personModel.find({ teamId: teamId })
        //  console.log(peopleData , peopleId);

        let rPeopleData = []
        if (peopleData && peopleData.length > 0) {
            rPeopleData = peopleData.filter(e => {
                // console.log(e._id.toString());
                return e._id.toString() === peopleId
            })
        }
        // console.log(rPeopleData[0].mentor);
        let rPeopleMData = []
        if (rPeopleData && rPeopleData.length > 0) {
            rPeopleMData = peopleData.filter(e => {
                return e._id.toString() === rPeopleData[0].mentor.toString()
            })
        }

        let rPeopleMMData = []
        if (rPeopleData && rPeopleData.length > 0 && rPeopleData[0].mentees && rPeopleData[0].mentees.length > 0) {
            for (let t = 0; t < rPeopleData[0].mentees.length; t++) {
                rPeopleMMData = peopleData.filter(e => {
                    return e._id.toString() === rPeopleData[0].mentees[t].toString()
                })
            }
        }

        let peopleDatas = {
            rPeopleData: rPeopleData,
            rPeopleMData: rPeopleMData,
            rPeopleMMData: rPeopleMMData
        }
        return res.status(200).send({ status: true, message: "Report People Get successfully", data: peopleData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getSkillReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let data = await skillModel.find({ teamId: teamId })
        //  console.log(data);

        let ReportSkill = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let reportSkillData = data[i].owners
                for (let j = 0; j < reportSkillData.length; j++) {
                    if (reportSkillData[j].toString() === peopleId.toString()) {
                        ReportSkill.push(data[i])
                    }
                }
            }
        }

        // console.log(ReportSkill);

        return res.status(200).send({ status: true, message: "Report Skill Get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getRoleReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let data = await roleModel.find({ teamId: teamId })
        //  console.log(data);

        let ReportRole = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let reportRoleData = data[i].owners
                for (let j = 0; j < reportRoleData.length; j++) {
                    if (reportRoleData[j].toString() === peopleId.toString()) {
                        ReportRole.push(data[i])
                    }
                }
            }
        }

        // console.log(ReportRole);

        return res.status(200).send({ status: true, message: "Report Role Get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getDomainReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let data = await domainModel.find({ teamId: teamId })
        //  console.log(data);

        let ReportDomain = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let reportDomainData = data[i].owners.owner
                // console.log(reportDomainData.toString() === peopleId ); 
                if (reportDomainData && peopleId && reportDomainData.toString() === peopleId.toString()) {
                    ReportDomain.push(data[i])
                }
            }
        }

        // console.log(ReportDomain);

        return res.status(200).send({ status: true, message: "Report Role Get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getLinkReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let data = await linkModel.find({ teamId: teamId })
        //  console.log(data);

        let ReportLink = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let reportLinkData = data[i].owner
                if (reportLinkData && peopleId && reportLinkData.toString() === peopleId.toString()) {
                    ReportLink.push(data[i])
                }
            }
        }

        // console.log(ReportLink);

        return res.status(200).send({ status: true, message: "Report Link Get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getCircleReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(req.headers);

        let skillData = await skillModel.find({ teamId: teamId })

        let ReportSkill = []
        if (skillData && skillData.length > 0) {
            for (let i = 0; i < skillData.length; i++) {
                let reportSkillData = skillData[i].owners
                for (let j = 0; j < reportSkillData.length; j++) {
                    if (reportSkillData[j] && peopleId && reportSkillData[j].toString() === peopleId.toString()) {
                        ReportSkill.push({ Id: skillData[i]._id.toString(), name: skillData[i].skillName })
                    }
                }
            }
        }

        let RoleData = await roleModel.find({ teamId: teamId })

        let ReportRole = []
        if (RoleData && RoleData.length > 0) {
            for (let i = 0; i < RoleData.length; i++) {
                let reportRoleData = RoleData[i].owners
                for (let j = 0; j < reportRoleData.length; j++) {
                    if (peopleId && reportRoleData[j].toString() === peopleId.toString()) {
                        ReportRole.push({ Id: RoleData[i]._id.toString(), name: RoleData[i].roleName })
                    }
                }
            }
        }


        let DomainData = await roleModel.find({ teamId: teamId })
        // console.log(DomainData)

        let ReportDomain = []
        if (DomainData && DomainData.length > 0) {
            for (let i = 0; i < DomainData.length; i++) {
                let reportDomainData = DomainData[i].owners
                // console.log(reportDomainData.toString() === peopleId ); 
                if (reportDomainData && peopleId && reportDomainData.toString() === peopleId.toString()) {
                    ReportDomain.push({ Id: DomainData[i]._id.toString(), name: DomainData[i].domainName })
                }
            }
        }



        let linkData = await linkModel.find({ teamId: teamId })

        let ReportLink = []
        if (linkData && linkData.length > 0) {
            for (let i = 0; i < linkData.length; i++) {
                let reportLinkData = linkData[i].owner
                if (reportLinkData && peopleId && reportLinkData.toString() === peopleId.toString()) {
                    ReportLink.push({ Id: linkData[i]._id.toString(), name: linkData[i].linkName })
                }
            }
        }


        let circlesData = await circleModel.find({ teamId: teamId })
        let membersData = await memberModel.find({ teamId: teamId })

        let curCircleData = []
        if (membersData && membersData.length > 0 && (ReportSkill.length > 0 || ReportRole.length > 0 || ReportDomain.length > 0 || ReportLink.length > 0)) {
            for (let j = 0; j < membersData.length; j++) {
                var core = []
                var extend = []
                if (ReportSkill && ReportSkill.length > 0) {
                    for (let k = 0; k < ReportSkill.length; k++) {
                        let inc = membersData[j].coreMembers.Skills.includes(ReportSkill[k].Id)
                        let incs = membersData[j].extendedMembers.Skills.includes(ReportSkill[k].Id)
                        if (inc) {
                            core.push(ReportSkill[k])
                        }
                        if (incs) {
                            extend.push(ReportSkill[k])
                        }
                    }
                }
                if (ReportRole && ReportRole.length > 0) {
                    for (let k = 0; k < ReportRole.length; k++) {
                        let inc = membersData[j].coreMembers.Roles.includes(ReportRole[k].Id)
                        let incs = membersData[j].extendedMembers.Roles.includes(ReportRole[k].Id)
                        if (inc) {
                            core.push(ReportRole[k])
                        }
                        if (incs) {
                            extend.push(ReportRole[k])
                        }
                    }
                }

                if (ReportDomain && ReportDomain.length > 0) {
                    for (let k = 0; k < ReportDomain.length; k++) {
                        let inc = membersData[j].coreMembers.Domains.includes(ReportDomain[k].Id)
                        let incs = membersData[j].extendedMembers.Domains.includes(ReportDomain[k].Id)
                        if (inc) {
                            core.push(ReportDomain[k])
                        }
                        if (incs) {
                            extend.push(ReportDomain[k])
                        }
                    }
                }

                if (ReportLink && ReportLink.length > 0) {
                    for (let k = 0; k < ReportLink.length; k++) {
                        let inc = membersData[j].coreMembers.Links.includes(ReportLink[k].Id)
                        let incs = membersData[j].extendedMembers.Links.includes(ReportLink[k].Id)
                        if (inc) {
                            core.push(ReportLink[k])
                        }
                        if (incs) {
                            extend.push(ReportLink[k])
                        }
                    }
                }
                curCircleData.push({ memberId: membersData[j].memberType, core: core, extend: extend })
            }
        }


        // console.log(curCircleData)
        let curCirclesDatas = []
        if (circlesData && circlesData.length > 0 && curCircleData.length > 0) {
            for (let i = 0; i < circlesData.length; i++) {
                for (let j = 0; j < curCircleData.length; j++) {
                    if (circlesData[i]._id.toString() === curCircleData[j].memberId.toString()) {
                        curCirclesDatas.push({ ...circlesData[i], ...curCircleData[j] })
                    }
                }
            }
        }

        if (membersData.length > 0 && curCirclesDatas.length > 0) {
            for (let i = 0; i < curCirclesDatas.length; i++) {
                for (let j = 0; j < membersData.length; j++) {
                    if (membersData[j].memberType.toString() === curCirclesDatas[i].memberId.toString()) {
                        curCirclesDatas[i].members = membersData[j]
                    }
                }
            }
        }

        // console.log(curCirclesDatas);

        return res.status(200).send({ status: true, message: "Report Role Get successfully", data: curCirclesDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getProjectsReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let skillData = await skillModel.find({ teamId: teamId })

        let ReportSkill = []
        if (skillData && skillData.length > 0) {
            for (let i = 0; i < skillData.length; i++) {
                let reportSkillData = skillData[i].owners
                for (let j = 0; j < reportSkillData.length; j++) {
                    if (reportSkillData[j] && peopleId && reportSkillData[j].toString() === peopleId.toString()) {
                        ReportSkill.push({ Id: skillData[i]._id.toString(), name: skillData[i].skillName })
                    }
                }
            }
        }

        let RoleData = await roleModel.find({ teamId: teamId })

        let ReportRole = []
        if (RoleData && RoleData.length > 0) {
            for (let i = 0; i < RoleData.length; i++) {
                let reportRoleData = RoleData[i].owners
                for (let j = 0; j < reportRoleData.length; j++) {
                    if (peopleId && reportRoleData[j].toString() === peopleId.toString()) {
                        ReportRole.push({ Id: RoleData[i]._id.toString(), name: RoleData[i].roleName })
                    }
                }
            }
        }


        let DomainData = await roleModel.find({ teamId: teamId })
        // console.log(DomainData)

        let ReportDomain = []
        if (DomainData && DomainData.length > 0) {
            for (let i = 0; i < DomainData.length; i++) {
                let reportDomainData = DomainData[i].owners
                // console.log(reportDomainData.toString() === peopleId ); 
                if (reportDomainData && peopleId && reportDomainData.toString() === peopleId.toString()) {
                    ReportDomain.push({ Id: DomainData[i]._id.toString(), name: DomainData[i].domainName })
                }
            }
        }
        // console.log(ReportDomain)



        let linkData = await linkModel.find({ teamId: teamId })

        let ReportLink = []
        if (linkData && linkData.length > 0) {
            for (let i = 0; i < linkData.length; i++) {
                let reportLinkData = linkData[i].owner
                if (reportLinkData && peopleId && reportLinkData.toString() === peopleId.toString()) {
                    ReportLink.push({ Id: linkData[i]._id.toString(), name: linkData[i].linkName })
                }
            }
        }


        let projectsData = await projectModel.find({ teamId: teamId })
        let membersData = await memberModel.find({ teamId: teamId })

        let curProjectData = []
        if (membersData && membersData.length > 0 && (ReportSkill.length > 0 || ReportRole.length > 0 || ReportDomain.length > 0 || ReportLink.length > 0)) {
            for (let j = 0; j < membersData.length; j++) {
                var core = []
                var extend = []
                if (ReportSkill && ReportSkill.length > 0) {
                    for (let k = 0; k < ReportSkill.length; k++) {
                        let inc = membersData[j].coreMembers.Skills.includes(ReportSkill[k].Id)
                        let incs = membersData[j].extendedMembers.Skills.includes(ReportSkill[k].Id)
                        if (inc) {
                            core.push(ReportSkill[k])
                        }
                        if (incs) {
                            extend.push(ReportSkill[k])
                        }
                    }
                }
                if (ReportRole && ReportRole.length > 0) {
                    for (let k = 0; k < ReportRole.length; k++) {
                        let inc = membersData[j].coreMembers.Roles.includes(ReportRole[k].Id)
                        let incs = membersData[j].extendedMembers.Roles.includes(ReportRole[k].Id)
                        if (inc) {
                            core.push(ReportRole[k])
                        }
                        if (incs) {
                            extend.push(ReportRole[k])
                        }
                    }
                }

                if (ReportDomain && ReportDomain.length > 0) {
                    for (let k = 0; k < ReportDomain.length; k++) {
                        let inc = membersData[j].coreMembers.Domains.includes(ReportDomain[k].Id)
                        let incs = membersData[j].extendedMembers.Domains.includes(ReportDomain[k].Id)
                        if (inc) {
                            core.push(ReportDomain[k])
                        }
                        if (incs) {
                            extend.push(ReportDomain[k])
                        }
                    }
                }

                if (ReportLink && ReportLink.length > 0) {
                    for (let k = 0; k < ReportLink.length; k++) {
                        let inc = membersData[j].coreMembers.Links.includes(ReportLink[k].Id)
                        let incs = membersData[j].extendedMembers.Links.includes(ReportLink[k].Id)
                        if (inc) {
                            core.push(ReportLink[k])
                        }
                        if (incs) {
                            extend.push(ReportLink[k])
                        }
                    }
                }
                curProjectData.push({ memberId: membersData[j].memberType, core: core, extend: extend })
            }
        }


        let curProjectsDatas = []
        if (projectsData && projectsData.length > 0 && curProjectData.length > 0) {
            for (let i = 0; i < projectsData.length; i++) {
                for (let j = 0; j < curProjectData.length; j++) {
                    if (projectsData[i]._id.toString() === curProjectData[j].memberId.toString()) {
                        curProjectsDatas.push({ ...projectsData[i], ...curProjectData[j] })
                    }
                }
            }
        }

        // console.log(curProjectsDatas);

        if (membersData.length > 0 && curProjectsDatas.length > 0) {
            for (let i = 0; i < curProjectsDatas.length; i++) {
                for (let j = 0; j < membersData.length; j++) {
                    if (membersData[j].memberType.toString() === curProjectsDatas[i].memberId.toString()) {
                        curProjectsDatas[i].members = membersData[j]
                    }
                }
            }
        }

        return res.status(200).send({ status: true, message: "Report Projects Get successfully", data: curProjectsDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getMeetingsReport = async (req, res) => {
    try {
        // using destructuring of body data.
        let teamId = req.headers.teamid
        let peopleId = req.headers.peopleid
        // console.log(peopleId);

        let skillData = await skillModel.find({ teamId: teamId })

        let ReportSkill = []
        if (skillData && skillData.length > 0) {
            for (let i = 0; i < skillData.length; i++) {
                let reportSkillData = skillData[i].owners
                for (let j = 0; j < reportSkillData.length; j++) {
                    if (reportSkillData[j] && peopleId && reportSkillData[j].toString() === peopleId.toString()) {
                        ReportSkill.push({ Id: skillData[i]._id.toString(), name: skillData[i].skillName })
                    }
                }
            }
        }

        let RoleData = await roleModel.find({ teamId: teamId })

        let ReportRole = []
        if (RoleData && RoleData.length > 0) {
            for (let i = 0; i < RoleData.length; i++) {
                let reportRoleData = RoleData[i].owners
                for (let j = 0; j < reportRoleData.length; j++) {
                    if (peopleId && reportRoleData[j].toString() === peopleId.toString()) {
                        ReportRole.push({ Id: RoleData[i]._id.toString(), name: RoleData[i].roleName })
                    }
                }
            }
        }


        let DomainData = await roleModel.find({ teamId: teamId })
        // console.log(DomainData)

        let ReportDomain = []
        if (DomainData && DomainData.length > 0) {
            for (let i = 0; i < DomainData.length; i++) {
                let reportDomainData = DomainData[i].owners
                // console.log(reportDomainData.toString() === peopleId ); 
                if (reportDomainData && peopleId && reportDomainData.toString() === peopleId.toString()) {
                    ReportDomain.push({ Id: DomainData[i]._id.toString(), name: DomainData[i].domainName })
                }
            }
        }
        // console.log(ReportDomain)



        let linkData = await linkModel.find({ teamId: teamId })

        let ReportLink = []
        if (linkData && linkData.length > 0) {
            for (let i = 0; i < linkData.length; i++) {
                let reportLinkData = linkData[i].owner
                if (reportLinkData && peopleId && reportLinkData.toString() === peopleId.toString()) {
                    ReportLink.push({ Id: linkData[i]._id.toString(), name: linkData[i].domainName })
                }
            }
        }

        let circlesData = await circleModel.find({ teamId: teamId })
        let projectsData = await projectModel.find({ teamId: teamId })
        let membersData = await memberModel.find({ teamId: teamId })
        let meetingData = await meetingModel.find({ teamId: teamId })

        let curProjectData = []
        if (membersData && membersData.length > 0 && (ReportSkill.length > 0 || ReportRole.length > 0 || ReportDomain.length > 0 || ReportLink.length > 0)) {
            for (let j = 0; j < membersData.length; j++) {
                var core = []
                var extend = []
                if (ReportSkill && ReportSkill.length > 0) {
                    for (let k = 0; k < ReportSkill.length; k++) {
                        let inc = membersData[j].coreMembers.Skills.includes(ReportSkill[k].Id)
                        let incs = membersData[j].extendedMembers.Skills.includes(ReportSkill[k].Id)
                        if (inc) {
                            core.push(ReportSkill[k])
                        }
                        if (incs) {
                            extend.push(ReportSkill[k])
                        }
                    }
                }
                if (ReportRole && ReportRole.length > 0) {
                    for (let k = 0; k < ReportRole.length; k++) {
                        let inc = membersData[j].coreMembers.Roles.includes(ReportRole[k].Id)
                        let incs = membersData[j].extendedMembers.Roles.includes(ReportRole[k].Id)
                        if (inc) {
                            core.push(ReportRole[k])
                        }
                        if (incs) {
                            extend.push(ReportRole[k])
                        }
                    }
                }

                if (ReportDomain && ReportDomain.length > 0) {
                    for (let k = 0; k < ReportDomain.length; k++) {
                        let inc = membersData[j].coreMembers.Domains.includes(ReportDomain[k].Id)
                        let incs = membersData[j].extendedMembers.Domains.includes(ReportDomain[k].Id)
                        if (inc) {
                            core.push(ReportDomain[k])
                        }
                        if (incs) {
                            extend.push(ReportDomain[k])
                        }
                    }
                }

                if (ReportLink && ReportLink.length > 0) {
                    for (let k = 0; k < ReportLink.length; k++) {
                        let inc = membersData[j].coreMembers.Links.includes(ReportLink[k].Id)
                        let incs = membersData[j].extendedMembers.Links.includes(ReportLink[k].Id)
                        if (inc) {
                            core.push(ReportLink[k])
                        }
                        if (incs) {
                            extend.push(ReportLink[k])
                        }
                    }
                }
                curProjectData.push({ memberId: membersData[j].memberType, core: core, extend: extend })
            }
        }



        let curMeetingsDatas = []
        if (circlesData && circlesData.length > 0 && curProjectData.length > 0) {
            for (let i = 0; i < circlesData.length; i++) {
                for (let j = 0; j < curProjectData.length; j++) {
                    if (circlesData[i]._id.toString() === curProjectData[j].memberId.toString()) {
                        for (let k = 0; k < circlesData[i].meetings.length; k++) {
                            curMeetingsDatas.push({ Id: circlesData[i].meetings[k].toString(), memberId: circlesData[i]._id.toString(), name: `${circlesData[i].circleName} (circle)` })
                        }
                    }
                }
            }
        }



        if (projectsData && projectsData.length > 0 && curProjectData.length > 0) {
            for (let i = 0; i < projectsData.length; i++) {
                for (let j = 0; j < curProjectData.length; j++) {
                    if (projectsData[i]._id.toString() === curProjectData[j].memberId.toString()) {
                        for (let k = 0; k < projectsData[i].meetings.length; k++) {
                            curMeetingsDatas.push({ Id: projectsData[i].meetings[k].toString(), memberId: projectsData[i]._id.toString(), name: `${projectsData[i].projectName} (project)` })
                        }
                    }
                }
            }
        }


        let curMeetingDatas = []
        if (meetingData && meetingData.length > 0 && curMeetingsDatas && curMeetingsDatas.length > 0) {
            for (let i = 0; i < curMeetingsDatas.length; i++) {
                for (let j = 0; j < meetingData.length; j++) {
                    if (meetingData[j]._id.toString() === curMeetingsDatas[i].Id) {
                        curMeetingDatas.push({ ...meetingData[j], memberId: curMeetingsDatas[i].memberId, name: curMeetingsDatas[i].name })
                    }
                }
            }
        }

        // console.log(curMeetingDatas);

        return res.status(200).send({ status: true, message: "Report Meetings Get successfully", data: curMeetingDatas })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = {
    createRequestReport, reportReAccept, getTeamReport, getPeopleReport, getSkillReport,
    getRoleReport, getDomainReport, getLinkReport, getCircleReport, getProjectsReport, getMeetingsReport,
    reportGetByAdmin
}

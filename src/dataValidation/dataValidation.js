const mongoose = require('mongoose')
const { isValidRequest, isValidFName, isValidName, isValidEmail, isValidpass, isValidOwnerType,
    isValidTask, isValidDomain, isValidRole, isValidArrString, isValidAdministration,
    isValiddurationType, isValidrecurrenceType, isValidPhone, isValidObjectId, isValidOwners } = require('./inputDataValidation')


const isValideAdmin = (data) => {
    // using destructuring of body data.
    const { fname, lname, companyName, role, email, password, curTeam } = data;

    const Message = isValidRequest(data)
    if (Message) return Message;

    const fnameMessage = isValidFName(fname)
    if (fnameMessage) return fnameMessage;

    const lnameMessage = isValidFName(lname)
    if (lnameMessage) return lnameMessage;

    if (companyName) {
        const cNameMessage = isValidName(companyName)
        if (cNameMessage) return cNameMessage;
    }

    if (role) {
        if (!(role === 'Admin')) {
            data.role = 'User'
        }
    }

    const emailMessage = isValidEmail(email)
    if (emailMessage) return emailMessage;

    const passMessage = isValidpass(password)
    if (passMessage) return passMessage;

    // const curTeamMessage = isValidObjectId(curTeam)
    // if (curTeamMessage) return curTeamMessage;

}


const isValideUpdateAdmin = (data) => {

    // using destructuring of body data.
    const { fname, lname, companyName, email, password, curTeam } = data;

    if (data) {
        const Message = isValidRequest(data)
        if (Message) return Message;
    }

    if (fname) {
        // oldata.fname = fname
        const fnameMessage = isValidFName(fname)
        if (fnameMessage) return fnameMessage;
    }

    if (lname) {
        // oldata.lname = lname
        const lnameMessage = isValidFName(lname)
        if (lnameMessage) return lnameMessage;
    }

    if (companyName) {
        // oldata.companyName = companyName
        const cNameMessage = isValidName(companyName)
        if (cNameMessage) return cNameMessage;
    }

    if (email) {
        // oldata.email = email
        const emailMessage = isValidEmail(email)
        if (emailMessage) return emailMessage;
    }

    if (password) {
        const passMessage = isValidpass(password)
        if (passMessage) return passMessage;
    }

    // if (curTeam) {
    //     // oldata.curTeam = curTeam
    //     const curTeamMessage = isValidObjectId(curTeam)
    //     if (curTeamMessage) return curTeamMessage;
}


const isValideAdminLogin = (data) => {

    // using destructuring of body data.
    const { email, password } = data;

    const Message = isValidRequest(data)
    if (Message) return Message;

    const emailMessage = isValidEmail(email)
    if (emailMessage) return emailMessage;

    const passMessage = isValidpass(password)
    if (passMessage) return passMessage;
}


const isValideTeam = (datas) => {

    // using destructuring of body data.
    const { data, admin } = datas;

    for (let i = 0; i < data.length; i++) {
        const cNameMessage = isValidName(data[i].team_name)
        if (cNameMessage) return cNameMessage;
    }
}


const isValideUpdateTeam = (data, oldata) => {

    // using destructuring of body data.
    const { team_name } = data;

    if (team_name) {
        oldata.team_name = team_name
        const cNameMessage = isValidName(team_name)
        if (cNameMessage) return cNameMessage;
    }
}


const isValidePerson = (data) => {
    // using destructuring of body data.
    const { teamId, fname, lname, mobile, email, workRole, mentor, mentees, tags } = data
    if (mongoose.Types.ObjectId.isValid(teamId) == false) {
        return res.status(400).send({ status: false, message: "team Id is not valid" });
    }

    const fnameMessage = isValidFName(fname)
    if (fnameMessage) return fnameMessage;

    if (lname) {
        const lnameMessage = isValidFName(lname)
        if (lnameMessage) return lnameMessage;
    }

    if (mobile) {
        const mobileMessage = isValidPhone(mobile)
        if (mobileMessage) return mobileMessage;
    }

    if (email) {
        const emailMessage = isValidEmail(email)
        if (emailMessage) return emailMessage;
    }

    if (workRole) {
        const workRoleMessage = isValidFName(workRole)
        if (workRoleMessage) return workRoleMessage;
    }


    if (mentor) {
        const mentorMessage = isValidFName(mentor)
        if (mentorMessage) return mentorMessage;
    }

    if (mentees && mentees.length > 0) {
        for (let i = 0; i < mentees.length; i++) {
            const menteesMessage = isValidFName(mentees[i])
            if (menteesMessage) return menteesMessage;
        }
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }
}




const isValideUpdatePerson = (data) => {
    // using destructuring of body data.
    const { teamId, fname, lname, mobile, email, workRole, mentor, mentees, tags } = data
    if (mongoose.Types.ObjectId.isValid(teamId) == false) {
        return res.status(400).send({ status: false, message: "teamId is not valid" });
    }

    if (fname) {
        const fnameMessage = isValidFName(fname)
        if (fnameMessage) return fnameMessage;
        // oldata.fname = fname
    }

    if (lname) {
        const lnameMessage = isValidFName(lname)
        if (lnameMessage) return lnameMessage;
        // oldata.lname = lname
    }

    if (mobile) {
        const mobileMessage = isValidPhone(mobile)
        if (mobileMessage) return mobileMessage;
        // oldata.mobile = mobile
    }

    if (email) {
        const emailMessage = isValidEmail(email)
        if (emailMessage) return emailMessage;
        // oldata.email = email
    }

    if (workRole) {
        const workRoleMessage = isValidFName(workRole)
        if (workRoleMessage) return workRoleMessage;
        // oldata.workRole = workRole
    }

    if (mentor) {
        const mentorMessage = isValidFName(mentor)
        if (mentorMessage) return mentorMessage;
        // oldata.mentor = mentor
    }

    if (mentees) {
        for (let i = 0; i < mentees.length; i++) {
            const menteesMessage = isValidFName(mentees[i])
            if (menteesMessage) return menteesMessage;
        }
        // oldata.mentees = mentees
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }
}



const isValideSkill = (data) => {
    // using destructuring of body data.
    const { teamId, skillName, purpose, tasks, ownerType, owners, domains, memberIn, tags } = data
    console.log('244')
    const snameMessage = isValidFName(skillName)
    if (snameMessage) return snameMessage;
    console.log('247')
    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }
    console.log('252')
    if (tasks && tasks.length > 0) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }
    console.log('257')
    if (ownerType) {
        const ownerTypeMessage = isValidName(ownerType)
        if (ownerTypeMessage) return ownerTypeMessage;
    }

    console.log('263')
    if (owners && owners.length > 0) {
        const ownerMessage = isValidArrString(owners)
        if (ownerMessage) return ownerMessage;
    }

    console.log('269')
    if (domains && domains.length > 0) {
        const domainMessage = isValidDomain(domains)
        if (domainMessage) return domainMessage;
    }
    console.log('274')
    if (memberIn && memberIn.length > 0) {
        const memberInMessage = isValidObjectId(memberIn)
        if (memberInMessage) return memberInMessage;
    }
    console.log('279')
    if (tags && tags.length > 0) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }
    console.log('284')
}


const isValideUpdateSkill = (data) => {
    // using destructuring of body data.
    const { teamId, skillName, purpose, tasks, ownerType, owners, domains, memberIn, tags } = data


    if (skillName) {
        const snameMessage = isValidFName(skillName)
        if (snameMessage) return snameMessage;
        // oldata.skillName = skillName
    }


    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
        // oldata.purpose = purpose
    }

    if (tasks && tasks.length > 0) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
        // oldata.tasks = tasks
    }

    if (ownerType) {
        const owner_roleMessage = isValidOwnerType(ownerType)
        if (owner_roleMessage) return owner_roleMessage;
        // oldata.ownerType = ownerType
    }


    if (owners && owners.length > 0) {
        const ownerMessage = isValidArrString(owners)
        if (ownerMessage) return ownerMessage;
        // oldata.owners = owners
    }


    if (domains && domains.length > 0) {
        const domainMessage = isValidDomain(domains)
        if (domainMessage) return domainMessage;
        // oldata.domains = domains
    }

    // if (memberIn && memberIn.length > 0) {
    //     const memberInMessage = isValidName(memberIn)
    //     if (memberInMessage) return memberInMessage;
    //     // oldata.memberIn = memberIn
    // }

    if (tags && tags.length > 0) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }

}


const isValideRole = (data) => {
    // using destructuring of body data.
    const { teamId, roleName, purpose, tasks, ownerRole, owners, domains, memberIn, tags } = data


    const rnameMessage = isValidFName(roleName)
    if (rnameMessage) return rnameMessage;


    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (ownerRole) {
        const ownerRoleMessage = isValidName(ownerRole)
        if (ownerRoleMessage) return ownerRoleMessage;
    }

    if (owners && owners.length > 0) {
        const ownerMessage = isValidArrString(owners)
        if (ownerMessage) return ownerMessage;
    }

    if (domains) {
        const domainMessage = isValidDomain(domains)
        if (domainMessage) return domainMessage;
    }

    if (memberIn && memberIn.length > 0) {
        const memberInMessage = isValidObjectId(memberIn)
        if (memberInMessage) return memberInMessage;
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }

}


const isValideUpdateRole = (data, oldata) => {
    // using destructuring of body data.
    const { team_name, roleName, purpose, tasks, ownerRole, owners, domains, memberIn, tags } = data


    if (roleName) {
        const rnameMessage = isValidFName(roleName)
        if (rnameMessage) return rnameMessage;
        // oldata.roleName = roleName
    }

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (ownerRole) {
        const ownerRoleMessage = isValidName(ownerRole)
        if (ownerRoleMessage) return ownerRoleMessage;
    }

    if (owners && owners.length > 0) {
        const ownerMessage = isValidArrString(owners)
        if (ownerMessage) return ownerMessage;
    }

    if (domains) {
        const domainMessage = isValidDomain(domains)
        if (domainMessage) return domainMessage;
    }

    if (memberIn && memberIn.length > 0) {
        const memberInMessage = isValidObjectId(memberIn)
        if (memberInMessage) return memberInMessage;
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }

}


const isValideCircle = (data) => {

    // using destructuring of body data.
    const { teamId, circleName, purpose, tasks, lead, leadToDos, meetings, standIn, administration, tags } = data;

    const circleMessage = isValidFName(circleName)
    if (circleMessage) return circleMessage;

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (lead) {
        const leadMessage = isValidObjectId(lead)
        if (leadMessage) return leadMessage;
    }

    if (leadToDos) {
        const leadToDosMessage = isValidTask(leadToDos)
        if (leadToDosMessage) return leadToDosMessage;
    }

    if (meetings && meetings.length > 0) {
        for (let i = 0; i < meetings.length; i++) {
            const meetingsMessage = isValidObjectId(meetings[i])
            if (meetingsMessage) return meetingsMessage;
        }
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
    }

    if (administration) {
        const administrationMessage = isValidAdministration(administration)
        if (administrationMessage) return administrationMessage;
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }

}


const isValideUpdateCircle = (data, oldata) => {
    // using destructuring of body data.
    const { teamId, circleName, purpose, tasks, lead, leadToDos, meetings, standIn, administration, tags } = data;

    if (circleName) {
        const circleMessage = isValidName(circleName)
        if (circleMessage) return circleMessage;
        // oldata.circleName = circleName
    }

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
        // oldata.purpose = purpose
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
        // oldata.tasks = tasks
    }

    if (lead) {
        const leadMessage = isValidObjectId(lead)
        if (leadMessage) return leadMessage;
        // oldata.lead = lead
    }

    if (leadToDos) {
        const leadToDosMessage = isValidTask(leadToDos)
        if (leadToDosMessage) return leadToDosMessage;
        // oldata.lead = lead
    }

    if (meetings.length > 0) {
        for (let i = 0; i < meetings.length; i++) {
            // console.log(typeof meetings[i])
            const meetingsMessage = isValidObjectId(meetings[i])
            if (meetingsMessage) return meetingsMessage;
        }
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
        // oldata.standIn = standIn
    }

    if (administration) {
        const administrationMessage = isValidAdministration(administration)
        if (administrationMessage) return administrationMessage;
        // oldata.administration = administration
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }

}

const isValideMeetings = (data) => {
    //
    const { meetingsName, meetingsPurpse, recurrence, duration, durationType, recurrenceType, XTD } = data

    if (meetingsName) {
        const meetingsNameMessage = isValidName(meetingsName)
        if (meetingsNameMessage) return meetingsNameMessage;
    }

    if (meetingsPurpse) {
        const meetingsPurpseMessage = isValidName(meetingsPurpse)
        if (meetingsPurpseMessage) return meetingsPurpseMessage;
    }

    if (recurrence) {
        const durationMessage = isValidFName(duration)
        if (durationMessage) return durationMessage;
    }

    if (durationType) {
        const durationTypeMessage = isValiddurationType(durationType)
        if (durationTypeMessage) return durationTypeMessage;
    }

    if (recurrenceType) {
        const recurrenceTypeMessage = isValidrecurrenceType(recurrenceType)
        if (recurrenceTypeMessage) return recurrenceTypeMessage;
    }

}


const isValideUpdateMeetings = (data, oldData) => {
    //
    const { meetingsName, meetingsPurpse, recurrence, duration, durationType, recurrenceType, XTD } = data

    if (meetingsName) {
        const meetingsNameMessage = isValidName(meetingsName)
        if (meetingsNameMessage) return meetingsNameMessage;
        // oldData.meetingsName = meetingsName
    }

    if (meetingsPurpse) {
        const meetingsPurpseMessage = isValidName(meetingsPurpse)
        if (meetingsPurpseMessage) return meetingsPurpseMessage;
        // oldData.meetingsPurpse = meetingsPurpse
    }

    if (recurrence) {
        const durationMessage = isValidFName(duration)
        if (durationMessage) return durationMessage;
        // oldData.recurrence = recurrence
    }

    if (durationType) {
        const durationTypeMessage = isValiddurationType(durationType)
        if (durationTypeMessage) return durationTypeMessage;
        // oldData.durationType = durationType
    }

    if (recurrenceType) {
        const recurrenceTypeMessage = isValidrecurrenceType(recurrenceType)
        if (recurrenceTypeMessage) return recurrenceTypeMessage;
        // oldData.recurrenceType = recurrenceType
    }
}


const isValideProject = (data) => {
    // using destructuring of body data.
    const { team, projectName, purpose, tasks, lead, leadToDos, meetings, standIn, tags } = data;
    // const { statusReport, owner } = administration

    const dnameMessage = isValidFName(projectName)
    if (dnameMessage) return dnameMessage;

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }
    console.log(626);
    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (lead) {
        const leadMessage = isValidObjectId(lead)
        if (leadMessage) return leadMessage;
    }

    if (meetings && meetings.length > 0) {
        for (let i = 0; i < meetings.length; i++) {
            const meetingsMessage = isValidObjectId(meetings[i])
            if (meetingsMessage) return meetingsMessage;
        }
    }

    if (leadToDos) {
        const leadToDosMessage = isValidTask(leadToDos)
        if (leadToDosMessage) return leadToDosMessage;
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn) //isValidAdministration
        if (standInMessage) return standInMessage;
    }

    // if (administration && administration.length > 0) {
    //     const administrationMessage = isValidAdministration(administration) //isValidAdministration
    //     if (administrationMessage) return administrationMessage;
    // }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }
}


const isValideUpdateProject = (data, oldata) => {
    // using destructuring of body data.
    const { team, projectName, purpose, tasks, lead, leadToDos, meetings, standIn, administration, tags } = data;

    if (projectName) {
        const dnameMessage = isValidFName(projectName)
        if (dnameMessage) return dnameMessage;
        // oldata.projectName = projectName
    }


    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
        // oldata.purpose = purpose
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
        // oldata.tasks = tasks
    }

    if (lead) {
        const leadMessage = isValidObjectId(lead)
        if (leadMessage) return leadMessage;
        // oldata.lead = lead
    }

    if (meetings.length > 0) {
        for (let i = 0; i < meetings.length; i++) {
            const meetingsMessage = isValidObjectId(meetings[i])
            if (meetingsMessage) return meetingsMessage;
        }
    }


    if (leadToDos) {
        const leadToDosMessage = isValidTask(leadToDos)
        if (leadToDosMessage) return leadToDosMessage;
        // oldata.leadToDos = leadToDos
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn) //isValidAdministration
        if (standInMessage) return standInMessage;
        // oldata.standIn = standIn
    }

    if (administration) {
        const administrationMessage = isValidAdministration(administration) //isValidAdministration
        if (administrationMessage) return administrationMessage;
        // oldata.administration = administration
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }
}


const isValideDomain = (data) => {
    // using destructuring of body data.
    // team_name, domain_name, purpose, tasks,  owners, stand_in, memberIn, tags
    const { teamId, domainName, purpose, tasks, owners, standIn, memberIn, tags } = data


    const dnameMessage = isValidFName(domainName)
    if (dnameMessage) return dnameMessage;

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (owners) {

        const ownerMessage = isValidOwners(owners)
        if (ownerMessage) return ownerMessage;
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
    }

    if (memberIn) {
        const memberInMessage = isValidRole(memberIn)
        if (memberInMessage) return memberInMessage;
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }

}


const isValideUpdateDomain = (data, oldata) => {
    // using destructuring of body data.
    const { teamId, domainName, purpose, tasks, owners, standIn, memberIn, tags } = data


    if (domainName) {
        const dnameMessage = isValidFName(domainName)
        if (dnameMessage) return dnameMessage;
        // oldata.domainName = domainName
    }

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
        // oldata.purpose = purpose
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
        // oldata.tasks = tasks
    }


    if (owners) {
        console.log(owners)
        const ownerMessage = isValidOwners(owners)
        if (ownerMessage) return ownerMessage;
        // oldata.owners = owners
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
        // oldata.standIn = standIn
    }

    if (memberIn) {
        const memberInMessage = isValidRole(memberIn)
        if (memberInMessage) return memberInMessage;
        // oldata.memberIn = memberIn
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }

}


const isValideLink = (data) => {
    // using destructuring of body data.

    const { teamId, linkName, purpose, tasks, owner, standIn, memberIn, tags } = data

    const linknameMessage = isValidFName(linkName)
    if (linknameMessage) return linknameMessage;

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
    }

    if (owner) {
        const ownerMessage = isValidObjectId(owner)
        if (ownerMessage) return ownerMessage;
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
    }

    if (memberIn) {
        const memberInMessage = isValidOwners(memberIn)
        if (memberInMessage) return memberInMessage;
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
    }

}


const isValideUpdateLink = (data, oldata) => {
    // using destructuring of body data.
    const { teamId, linkName, purpose, tasks, owner, standIn, memberIn, tags } = data


    if (linkName) {
        const linknameMessage = isValidFName(linkName)
        if (linknameMessage) return linknameMessage;
        // oldata.linkname = linkName
    }

    if (purpose) {
        const purposeMessage = isValidName(purpose)
        if (purposeMessage) return purposeMessage;
        // oldata.purpose = purpose
    }

    if (tasks) {
        const tasksMessage = isValidTask(tasks)
        if (tasksMessage) return tasksMessage;
        // oldata.tasks = tasks
    }

    if (owner) {
        const ownerMessage = isValidObjectId(owner)
        if (ownerMessage) return ownerMessage;
        // oldata.owners = owners
    }

    if (standIn) {
        const standInMessage = isValidObjectId(standIn)
        if (standInMessage) return standInMessage;
        // oldata.standIn = standIn
    }

    if (memberIn) {
        const memberInMessage = isValidOwners(memberIn)
        if (memberInMessage) return memberInMessage;
        // oldata.memberIn = memberIn
    }

    if (tags) {
        const tagsMessage = isValidArrString(tags)
        if (tagsMessage) return tagsMessage;
        // oldata.tags = tags
    }

}


const isValideTags = (data) => {
    let { tags, userId } = data

    if (userId) {
        const userIdMessage = isValidObjectId(userId)
        if (userIdMessage) return userIdMessage;
    }
    if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            const tagsMessage = isValidFName(tags[i])
            if (tagsMessage) return tagsMessage;
        }
    }
}


const isValidUpdateMember = (data) => {

    let { teamId, memberType, coreMembers, extendedMembers } = data;

    //People, Skills, Roles, Links, Domains, Projects    
    if (teamId) {
        let teamMessage = isValidObjectId(teamId)
        if (teamMessage) return teamMessage;
    }

    if (memberType) {
        let memberMessage = isValidObjectId(memberType)
        if (memberMessage) return memberMessage;
    }


    let coreMessage = isValidRequest(coreMembers)
    if (coreMessage) return coreMessage;

    if (coreMembers.People && coreMembers.People.length > 0) {
        for (let i = 0; i < coreMembers.People; i++) {
            let peopleMessage = isValidObjectId(coreMembers.People[i])
            if (peopleMessage) return peopleMessage;
        }
    }

    if (coreMembers.Skills && coreMembers.Skills.length > 0) {
        for (let i = 0; i < coreMembers.Skills; i++) {
            let SkillsMessage = isValidObjectId(coreMembers.Skills[i])
            if (SkillsMessage) return SkillsMessage;
        }
    }

    if (coreMembers.Roles && coreMembers.Roles.length > 0) {
        for (let i = 0; i < coreMembers.Roles; i++) {
            let RolesMessage = isValidObjectId(coreMembers.Roles[i])
            if (RolesMessage) return RolesMessage;
        }
    }

    if (coreMembers.Links && coreMembers.Links.length > 0) {
        for (let i = 0; i < coreMembers.Links; i++) {
            let LinksMessage = isValidObjectId(coreMembers.Links[i])
            if (LinksMessage) return LinksMessage;
        }
    }

    if (coreMembers.Domains && coreMembers.Domains.length > 0) {
        for (let i = 0; i < coreMembers.Domains; i++) {
            let DomainsMessage = isValidObjectId(coreMembers.Domains[i])
            if (DomainsMessage) return DomainsMessage;
        }
    }

    if (coreMembers.Projects && coreMembers.Projects.length > 0) {
        for (let i = 0; i < coreMembers.Projects; i++) {
            let ProjectsMessage = isValidObjectId(coreMembers.Projects[i])
            if (ProjectsMessage) return ProjectsMessage;
        }
    }

    let extendedMessage = isValidRequest(extendedMembers)
    if (extendedMessage) return extendedMessage;


    if (extendedMembers.People && extendedMembers.People.length > 0) {
        for (let i = 0; i < extendedMembers.People; i++) {
            let peopleMessage = isValidObjectId(extendedMembers.People[i])
            if (peopleMessage) return peopleMessage;
        }
    }

    if (extendedMembers.Skills && extendedMembers.Skills.length > 0) {
        for (let i = 0; i < extendedMembers.Skills; i++) {
            let SkillsMessage = isValidObjectId(extendedMembers.Skills[i])
            if (SkillsMessage) return SkillsMessage;
        }
    }

    if (extendedMembers.Roles && extendedMembers.Roles.length > 0) {
        for (let i = 0; i < extendedMembers.Roles; i++) {
            let RolesMessage = isValidObjectId(extendedMembers.Roles[i])
            if (RolesMessage) return RolesMessage;
        }
    }

    if (extendedMembers.Links && extendedMembers.Links.length > 0) {
        for (let i = 0; i < extendedMembers.Links; i++) {
            let LinksMessage = isValidObjectId(extendedMembers.Links[i])
            if (LinksMessage) return LinksMessage;
        }
    }

    if (extendedMembers.Domains && extendedMembers.Domains.length > 0) {
        for (let i = 0; i < extendedMembers.Domains; i++) {
            let DomainsMessage = isValidObjectId(extendedMembers.Domains[i])
            if (DomainsMessage) return DomainsMessage;
        }
    }

    if (extendedMembers.Projects && extendedMembers.Projects.length > 0) {
        for (let i = 0; i < extendedMembers.Projects; i++) {
            let ProjectsMessage = isValidObjectId(extendedMembers.Projects[i])
            if (ProjectsMessage) return ProjectsMessage;
        }
    }
}



const isValidInfo = (data) => {
    let { teamId, infoCard, infoMassage } = data

    if (teamId) {
        let teamMessage = isValidObjectId(teamId)
        if (teamMessage) return teamMessage;
    }

    if (infoCard) {
        let arr = ['People', 'Skills', 'Roles', 'Domains', 'Links', 'Circles', 'Projects']
        let inc = arr.includes(infoCard)
        if (!inc) {
            return 'Invalid cards name'
        }
    }
}

const isValidNote = (data) => {
    let { teamId, noteCard, noteMassage } = data;

    if (teamId) {
        let teamMessage = isValidObjectId(teamId)
        if (teamMessage) return teamMessage;
    }

    if (noteCard) {
        let arr = ['People', 'Skills', 'Roles', 'Domains', 'Links', 'Circles', 'Projects']
        let inc = arr.includes(noteCard)
        if (!inc) {
            return 'Invalid cards name'
        }
    }

}



const currentTime = () => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date();
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "AM";
    if (hr > 12) {
        hr -= 12;
        ampm = "PM";
    }
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    let curTime = month + " " + date + ", " + year + " " + hr + ":" + min + " " + ampm;
    return curTime;
}




module.exports = {
    isValideAdmin, isValideAdminLogin, isValideUpdateAdmin,
    isValideTeam, isValideUpdateTeam, isValidePerson, isValideUpdatePerson,
    isValideSkill, isValideUpdateSkill, isValideRole, isValideUpdateRole,
    isValideCircle, isValideProject, isValideUpdateCircle,
    isValideMeetings, isValideUpdateMeetings, isValideUpdateProject, isValideLink,
    isValideUpdateLink, isValideDomain, isValideUpdateDomain, isValideTags,
    isValidUpdateMember, isValidInfo, isValidNote, currentTime
}
const express = require('express');
const router = express.Router();

const { createCircle, getCircle, updateCircle, deleteCircle } = require('../controllers/userController/circleController');
const { createskill, getskill, updateskill, deleteskill } = require('../controllers/userController/skilController');
const { createRole, getRole, updateRole, deleteRole } = require('../controllers/userController/roleController');
const { createLink, getLink, updateLink, deleteLink } = require('../controllers/userController/linkController');
const { createPerson, getPerson, updatePerson, deletePerson } = require('../controllers/userController/personController');
const { createDomain, getDomain, updateDomain, deleteDomain } = require('../controllers/userController/domainController');
const { createProject, getProject, updateProject, deleteProject } = require('../controllers/userController/projectController');
const { createRequestReport, reportGetByAdmin, reportReAccept, getTeamReport, getPeopleReport, getSkillReport, getRoleReport
    , getDomainReport, getLinkReport, getCircleReport, getProjectsReport, getMeetingsReport }
    = require('../controllers/userController/reportController')
const { permission } = require('../middlewares/permission');
const { authentication } = require('../middlewares/authentication');
const { authorization } = require('../middlewares/authorization');
const { createTags, getTags, deleteTags } = require('../controllers/userController/tagsController');
const { createMeetings, getMeetings, updateMeetings, deleteMeetings } = require('../controllers/userController/meetingsController')
const { createsStates, getStates, updateStates, deleteStates } = require('../controllers/userController/allController')
const { createMember, getMember, updateMember, deleteMember } = require('../controllers/userController/memberController')
const { historyCreate, historyget } = require('../controllers/historyController')
const { createInfo, getInfo, updateInfo } = require('../controllers/userController/infoController')
const { getAllProducts, getProductInvoic, getSubscription, deleteSubscription } = require('../controllers/userController/PricingController');
const { createNote, getNote } = require('../controllers/userController/noteController');
const { PFMemberUandC, getPFMember } = require('../controllers/userController/pfmemberController')


const { createAdminData } = require('../controllers/adminDataInput')


//------------------------------------------> (This is test api ) <--------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.get('/get-all-users', createAdminData)


//===================================================( All team api)======================================================///


//Person route

//-------------------------> (When person creat, call this api) <----------------------------------//

router.post("/person/create", authentication, authorization, permission, createPerson)

//-------------------------> (When person get,  call this api) <----------------------------------//

router.get("/person/get", authentication, authorization, permission, getPerson)

//-------------------------> (When person update,  call this api) <----------------------------------//

router.put("/person/update", authentication, authorization, permission, updatePerson)


//-------------------------> (When person delete,  call this api) <----------------------------------//

router.delete("/person/delete", authentication, authorization, permission, deletePerson)


//Skill route

//-------------------------> (When skill creat, call this api) <----------------------------------//

router.post("/skill/create", authentication, authorization, permission, createskill)

//-------------------------> (When skill get,  call this api) <----------------------------------//

router.get("/skill/get", authentication, authorization, permission, getskill)

//-------------------------> (When skill update,  call this api) <----------------------------------//

router.put("/skill/update", authentication, authorization, permission, updateskill)


//-------------------------> (When skill delete,  call this api) <----------------------------------//

router.delete("/skill/delete", authentication, authorization, permission, deleteskill)




//Role route


//-------------------------> (When role creat, call this api) <----------------------------------//

router.post("/role/create", authentication, authorization, permission, createRole)

//-------------------------> (When role get,  call this api) <----------------------------------//

router.get("/role/get", authentication, authorization, permission, getRole)

//-------------------------> (When role update,  call this api) <----------------------------------//

router.put("/role/update", authentication, authorization, permission, updateRole)


//-------------------------> (When role delete,  call this api) <----------------------------------//

router.delete("/role/delete", authentication, authorization, permission, deleteRole)



//Domain route



//-------------------------> (When domain creat, call this api) <----------------------------------//

router.post("/domain/create", authentication, authorization, permission, createDomain)

//-------------------------> (When domain get,  call this api) <----------------------------------//

router.get("/domain/get", authentication, authorization, permission, getDomain)

//-------------------------> (When domain update,  call this api) <----------------------------------//

router.put("/domain/update", authentication, authorization, permission, updateDomain)


//-------------------------> (When domain delete,  call this api) <----------------------------------//

router.delete("/domain/delete", authentication, authorization, permission, deleteDomain)



//Project route




//-------------------------> (When procircle creat, call this api) <----------------------------------//

router.post("/project/create", authentication, authorization, permission, createProject)

//-------------------------> (When procircle get,  call this api) <----------------------------------//

router.get("/project/get", authentication, authorization, permission, getProject)

//-------------------------> (When procircle update,  call this api) <----------------------------------//

router.put("/project/update", authentication, authorization, permission, updateProject)


//-------------------------> (When procircle delete,  call this api) <----------------------------------//

router.delete("/project/delete", authentication, authorization, permission, deleteProject)


//Circle route



//-------------------------> (When circle creat, call this api) <----------------------------------//

router.post("/circle/create", authentication, authorization, permission, createCircle)

//-------------------------> (When circle get,  call this api) <----------------------------------//

router.get("/circle/get", authentication, authorization, permission, getCircle)

//-------------------------> (When circle update,  call this api) <----------------------------------//

router.put("/circle/update", authentication, authorization, permission, updateCircle)


//-------------------------> (When circle delete,  call this api) <----------------------------------//

router.delete("/circle/delete", authentication, authorization, permission, deleteCircle)



//Link route


//-------------------------> (When link creat, call this api) <----------------------------------//

router.post("/link/create", authentication, authorization, permission, createLink)

//-------------------------> (When link get,  call this api) <----------------------------------//

router.get("/link/get", authentication, authorization, permission, getLink)

//-------------------------> (When link update,  call this api) <----------------------------------//

router.put("/link/update", authentication, authorization, permission, updateLink)


//-------------------------> (When link delete,  call this api) <----------------------------------//

router.delete("/link/delete", authentication, authorization, permission, deleteLink)



//Tags route


//-------------------------> (When t creat, call this api) <----------------------------------//

router.post("/tags/create", createTags)

//-------------------------> (When team get,  call this api) <----------------------------------//

router.get("/tags/get", getTags)

//-------------------------> (When team delete,  call this api) <----------------------------------//

router.delete("/tags/delete", authentication, authorization, permission, deleteTags)


// Meetings route


// //-------------------------> (When t creat, call this api) <----------------------------------//

router.post("/meetings/create", authentication, authorization, permission, createMeetings)

// //-------------------------> (When team get,  call this api) <----------------------------------//

router.get("/meetings/get", authentication, authorization, permission, getMeetings)

// //-------------------------> (When team update,  call this api) <----------------------------------//

router.put("/meetings/update", authentication, authorization, permission, updateMeetings)


// //-------------------------> (When team delete,  call this api) <----------------------------------//

router.delete("/meetings/delete", authentication, authorization, permission, deleteMeetings)



//States route


// //-------------------------> (When t creat, call this api) <----------------------------------//

router.post("/states/create", authentication, authorization, permission, createsStates)

// //-------------------------> (When team get,  call this api) <----------------------------------//

router.get("/states/get", authentication, authorization, permission, getStates)

// //-------------------------> (When team update,  call this api) <----------------------------------//

router.put("/states/update", authentication, authorization, permission, updateStates)


// //-------------------------> (When team delete,  call this api) <----------------------------------//

router.delete("/states/delete", authentication, authorization, permission, deleteStates)




//member route createMember, getMember, updateMember, deleteMember


// //-------------------------> (When member creat, call this api) <----------------------------------//

router.post("/member/create", authentication, authorization, permission, createMember)

// //-------------------------> (When member get,  call this api) <----------------------------------//

router.get("/member/get", authentication, authorization, permission, getMember)

// //-------------------------> (When member update,  call this api) <----------------------------------//

router.put("/member/update", authentication, authorization, permission, updateMember)


// //-------------------------> (When member delete,  call this api) <----------------------------------//

router.delete("/member/delete", authentication, authorization, permission, deleteMember)




// People focused add circle and project members

// PFMemberUandC, getPFMember

// //-------------------------> (When member creat, call this api) <----------------------------------//

router.post("/pfmember/create", authentication, authorization, permission, PFMemberUandC)

// //-------------------------> (When member get,  call this api) <----------------------------------//

router.get("/pfmember/get", authentication, authorization, permission, getPFMember)


// report

// //-------------------------> (When report creat,  call this api) <----------------------------------//

router.post("/report/create", createRequestReport)

router.post("/report/get-report-by-admin", reportGetByAdmin)

router.post("/report/report-auth", reportReAccept)

router.get("/report/get-report-team", getTeamReport)

router.get("/report/get-report-people", getPeopleReport)

router.get("/report/get-report-skill", getSkillReport)

router.get("/report/get-report-role", getRoleReport)

router.get("/report/get-report-domain", getDomainReport)

router.get("/report/get-report-link", getLinkReport)

router.get("/report/get-report-circle", getCircleReport)

router.get("/report/get-report-project", getProjectsReport)

router.get("/report/get-report-meeting", getMeetingsReport)






router.post("/history/create", historyCreate)

router.get("/history/get", historyget)





// Info 

//-------------------------> (When t creat, call this api) <----------------------------------//

router.post("/info/create", createInfo)

//-------------------------> (When team get,  call this api) <----------------------------------//

router.get("/info/get", getInfo)


//-------------------------> (When team get,  call this api) <----------------------------------//

router.put("/info/update", updateInfo)

//-------------------------> (When team delete,  call this api) <----------------------------------//

// router.delete("/info/delete",authentication ,authorization, permission  , deleteInfo)





//all pricing information 

router.get("/all/pricing", getAllProducts)


// getProductInvoic

router.get("/productInvoic", getProductInvoic)

// Note

// getSubscription

router.get("/getsub", getSubscription)

// /deletesub

router.delete("/deletesub", deleteSubscription)

// //-------------------------> (When report creat,  call this api) <----------------------------------//

router.post("/note/create", createNote)

router.get("/note/get", getNote)






module.exports = router;
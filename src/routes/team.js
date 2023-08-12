const express = require('express');
const router = express.Router();

const { createTeam, getTeam, updateTeam, deleteTeam, createCopyTeam, createTransferTeam } = require('../controllers/teamController')
const { permission } = require('../middlewares/permission')
const { authentication } = require('../middlewares/authentication')
const { authorization } = require('../middlewares/authorization')
const { deletPerson } = require('../controllers/deleteApi')

//------------------------------------------> (This is test api ) <--------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})



// ===================================================( All team api)======================================================///


//-------------------------> (When team creat, call this api) <----------------------------------//

router.post("/create", authentication, authorization, permission, createTeam)

//-------------------------> (When team get,  call this api) <----------------------------------//

router.get("/get", authentication, authorization, permission, getTeam)

//-------------------------> (When team update,  call this api) <----------------------------------//

router.put("/update", authentication, authorization, permission, updateTeam)


//-------------------------> (When team delete,  call this api) <----------------------------------//

router.delete("/delete", authentication, authorization, permission, deleteTeam)

// 

router.post("/copy/create", authentication, authorization, permission, createCopyTeam)


router.post("/transfer/create", authentication, authorization, permission, createTransferTeam)


router.delete("/people/delete", deletPerson)



module.exports = router;
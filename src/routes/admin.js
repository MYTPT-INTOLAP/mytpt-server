const express = require('express');
const router = express.Router();

const { createUser, loginUser, loginAdmin, googleLogins, getUser, updateUser, deleteUser, ReloginUser, getQrCodes, adminTotpVerify, adminLoginDataVerify,
    forgotPassword, passwordReset, redirectUser, registerUser, userVerify, paymentVerify, getUserMetaData, getUserAndMetaData} = require('../controllers/adminController')
const { permission } = require('../middlewares/permission')
const { authentication } = require('../middlewares/authentication')
const { authorization } = require('../middlewares/authorization')

//------------------------------------------> (This is test api ) <--------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})



// ===================================================( All admin api)======================================================///

// paymentVerify
//-------------------------> (When admin creat, call this api) <----------------------------------//

router.post("/signup", authentication, authorization, permission, createUser)

router.post("/register", registerUser)

router.put("/register", userVerify)

router.put("/payment-verify", paymentVerify)

// /admin/getmetadata

// adminLoginDataVerify 

router.post("/loginverify", adminLoginDataVerify)

router.post("/getqrcode", getQrCodes)

router.post("/verifyqrcode", adminTotpVerify)

router.get("/getmetadata", getUserMetaData)


router.get("/getuandmdata", getUserAndMetaData)

//-------------------------> (When user get, call this api) <----------------------------------//

router.get("/get", getUser)


//-------------------------> (When admin login,  call this api) <----------------------------------//

router.post("/adminLogin", loginAdmin)

//-------------------------> (When USER login,  call this api) <----------------------------------//

router.post("/login", loginUser)

router.post("/relogin", ReloginUser)

// googleLogin


router.post("/googleLogin", googleLogins)

//-------------------------> (When admin update,  call this api) <----------------------------------//

router.put("/update", authentication, authorization, permission, updateUser)

//-------------------------> (When admin delete,  call this api) <----------------------------------//

router.delete("/delete", authentication, authorization, permission, deleteUser)


//-------------------------> (When user password forget,  call this api) <----------------------------------//

router.post("/forgot-password", forgotPassword)


//-------------------------> (When user password reset,  call this api) <----------------------------------//

router.post("/reset-password", authentication, passwordReset)


//-------------------------> (When admin delete,  call this api) <----------------------------------//

router.post("/redirect", authentication, authorization, permission, redirectUser)



module.exports = router;
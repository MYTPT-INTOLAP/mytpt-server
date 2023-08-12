const adminModel = require("../models/Admin_Model/Admin");
const userMetaModel = require("../models/Admin_Model/userMeta");
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
const teamModel = require("../models/Team_Model/Team_Model");
const userHistoryModel = require("../models/Admin_Model/userHistory")
const usermetaModel = require("../models/Admin_Model/userMeta")
const { isValideAdmin, isValideAdminLogin, isValideUpdateAdmin } = require("../dataValidation/dataValidation")
const { isValidEmail, isValidpass } = require('../dataValidation/inputDataValidation')
const stripe = require('stripe')('sk_test_51MTPGBLkNe67mta9IuzVjbV78MWFlhGD6rEClMjy5FcA0C9C7GgvFh1ow6q5GamDfpejjT8F469RoSbsXFSrBuBs004HfSOZAw');
const { sendEmail } = require('../sender/emailSend')
const { addSubscriber } = require('../sender/mailchimp')
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { recaptcharVerify } = require('../sender/recaptcha')
const { BASE_URL, SERVER_URI, privateKey } = require('../Config/keys')

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');


// METHOD : CREATE

const createUser = async (req, res) => {
    try {
        // console.log("ok")
        // using destructuring of body data.
        let data = req.body
        const { fname, lname, companyName, role, email, password, teamId } = req.body;

        //Input data validation
        let msgUserData = isValideAdmin(data)
        if (msgUserData) {
            return res.status(400).send({ status: true, message: msgUserData });
        }

        const isEmailUnique = await adminModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: true, message: `This email address is already registered.` });
        }

        //Create user data after format fname, lname, companyName
        const hashedPassword = await bcrypt.hash(password.trim(), 10)
        const userData = {
            fname: fname.trim(),
            lname: lname.trim(),
            companyName: companyName.trim(),
            role: role,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        };
        // console.log(userData)

        const newUser = await adminModel.create(userData);

        return res.status(201).send({ status: true, message: "New User registered successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//Method User  registration

const registerUser = async (req, res) => {
    try {

        let data = req.body
        let { fname, lname, companyName, role, email, plan, prices, teamName, userUrl, password } = data


        let msgUserData = isValideAdmin(data)
        if (msgUserData) {
            return res.status(400).send({ status: true, message: msgUserData });
        }


        const isEmailUnique = await adminModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: true, message: `This email address is already registered.` });
        }

        //Create user data after format fname, lname, companyName
        const hashedPassword = await bcrypt.hash(password.trim(), 10)
        const userData = {
            fname: fname.trim(),
            lname: lname.trim(),
            companyName: companyName.trim(),
            role: role,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        };

        const newUser = await adminModel.create(userData);

        if (newUser) {
            const userMeta = {
                userId: newUser._id,
                isActive: true,
                plan: plan,
                validate: '30',
                userUrl: userUrl
            }
            await userMetaModel.create(userMeta);
        }

        if (newUser) {
            let userDatas = {
                team_name: teamName,
                userId: newUser._id
            };
            let resData = await teamModel.create(userDatas);
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
                        purpose: '', tasks: [], owners: { type: curRoles._id, owner: null },
                        standIn: null, tags: []
                    }
                    let resDomain = await domainModel.create(dDomain)
                    if (resDomain && Object.keys(resDomain).length > 0) {
                        let uRole = {
                            domains: [{ domain: resDomain._id, owner: null }]
                        }
                        await roleModel.findOneAndUpdate({ _id: curRoles._id }, uRole, { new: true })
                    }
                }
            }
        }

        let obj = {}
        obj.email = email
        obj.userId = newUser._id
        obj.plan = plan
        obj.prices = prices
        let token = jwt.sign(obj, privateKey, { expiresIn: "8h" });
        const link = `${BASE_URL}/register/${token}`
        await sendEmail(email, "email send successfuly", link)
        if (newUser) {
            let tags = ''
            if (plan === 'FTrial') {
                tags = 'free_trial_signup'
            } else if (plan === 'CLicense') {
                tags = 'paid_subscriber_company'
            } else if (plan === 'FLicense') {
                tags = 'paid_subscriber_individual'
            } else if (plan === 'Onboarding') {
                tags = 'paid_subscriber_onboarding'
            }
            let objs = {
                'EMAIL': email,
                'FIRSTNAME': fname,
                'LASTNAME': lname,
                'WEBSITE': userUrl,
                'COMPANY': companyName,
                'TEAM': teamName,
            }
            await addSubscriber(objs, tags)
        }

        return res.status(200).send({ status: true, message: 'Email sent successfully' })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.massage });
    }
}




//METHOD: userMetaData getUser

const getUserMetaData = async (req, res) => {
    try {
        let { adminid } = req.headers

        let userMetaData = await userMetaModel.findOne({ userId: adminid })

        if (!userMetaData) {
            return res.status(404).send({ status: false, message: 'User not found' })
        }

        return res.status(200).send({ status: true, message: 'Admin meta data get successfully', data: userMetaData })

    } catch (error) {
        return res.status(404).send({ status: false, message: error.massage });
    }
}



//METHOD: get all user and meta data


const getUserAndMetaData = async (req, res) => {
    try {
        let data = await adminModel.find({});
        // console.log('data')
        let datas = data.filter(e => e.role !== 'Admin')
        let userMetaData = await userMetaModel.find({})

        let userAllData = [];

        for (let i = 0; i < datas.length; i++) {
            for (let j = 0; j < userMetaData.length; j++) {
                if (datas[i]._id.toString() === userMetaData[j].userId.toString()) {
                    let obj = {
                        userId: datas[i]._id,
                        fname: datas[i].fname ? datas[i].fname : '',
                        lname: datas[i].lname ? datas[i].lname : '',
                        companyName: datas[i].companyName ? datas[i].companyName : '',
                        role: datas[i].role ? datas[i].role : '',
                        email: datas[i].email ? datas[i].email : '',
                        curTeam: datas[i].curTeam ? datas[i].curTeam : '',
                        isActive: userMetaData[j].isActive ? userMetaData[j].isActive : false,
                        plan: userMetaData[j].plan ? userMetaData[j].plan : "",
                        validate: userMetaData[j].validate ? userMetaData[j].validate : "",
                        userUrl: userMetaData[j].userUrl ? userMetaData[j].userUrl : '',
                        session_id: userMetaData[j].session_id ? userMetaData[j].session_id : '',
                        sessionToken: userMetaData[j].sessionToken ? userMetaData[j].sessionToken : "",
                        isActive2fa: userMetaData[j].isActive2fa ? userMetaData[j].isActive2fa : false,
                        is2fasecret: userMetaData[j].is2fasecret ? userMetaData[j].is2fasecret : ''
                    }
                    userAllData.push(obj)
                }
            }
        }


        let DataObject = {
            FTrial: 0,
            CLicense: 0,
            FLicense: 0,
            Consulting: 0,
            Lifetime: 0
        }

        if (userAllData && userAllData.length > 0) {
            for (let i = 0; i < userAllData.length; i++) {
                if (userAllData[i].plan === 'FTrial') {
                    DataObject.FTrial = DataObject.FTrial + 1;
                } else if (userAllData[i].plan === 'CLicense') {
                    DataObject.CLicense = DataObject.CLicense + 1;
                } else if (userAllData[i].plan === 'FLicense') {
                    DataObject.FLicense = DataObject.FLicense + 1;
                } else if (userAllData[i].plan === 'Consulting') {
                    DataObject.Consulting = DataObject.Consulting + 1;
                } else if (userAllData[i].plan === 'Lifetime') {
                    DataObject.Lifetime = DataObject.Lifetime + 1;
                }
            }
        }


        return res.status(200).send({ status: true, message: 'all user data get successfully', data: userAllData, UserData: DataObject })

    } catch (error) {
        return res.status(404).send({ status: false, message: error.massage });
    }
}




//METHOD : userVerify

const userVerify = async (req, res) => {
    try {
        let data = req.body
        let { userId, plan, prices, email } = data

        let metaData = await userMetaModel.findOne({ userId: userId })
        if (!metaData) {
            return res.status(404).send({ status: false, message: 'Data not found' })
        }

        if (metaData.plan === 'FTrial') {
            await userMetaModel.findByIdAndUpdate({ userId: userId }, { isActive: true }, { new: true });

            return res.status(200).send({ status: true, message: 'Email verified successfully' })
        }
        else if (metaData.plan === 'CLicense' || metaData.plan === 'FLicense') {
            const session = await stripe.checkout.sessions.create({
                success_url: `${BASE_URL}/register?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${BASE_URL}/pricing`,
                customer_email: email,
                tax_id_collection: {
                    enabled: true,
                },
                line_items: [
                    { price: prices, quantity: 1 },
                ],
                mode: 'subscription',
            });
            return res.status(200).send({ status: true, message: 'Email verified successfully', data: session })
        }



    } catch (error) {
        return res.status(404).send({ status: false, message: 'Verification failed, please try again.' });
    }
}



// METHOD : paymentVerify


const paymentVerify = async (req, res) => {
    try {
        let data = req.body
        let { session_id } = data

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.status !== 'complete') {
            return res.status(404).send({ status: false, message: 'unpaid' });
        } else if (session.status === 'complete') {

            let userData = await adminModel.findOne({ email: session.customer_details.email })

            await userMetaModel.findOneAndUpdate({ userId: userData._id.toString() }, { isActive: true, session_id: session_id }, { new: true });

            return res.status(200).send({ status: true, message: 'Email verifiy and payment successfully' })
        }
    } catch (error) {
        return res.status(404).send({ status: false, message: error.massage });
    }
}

// METHOD : LOGIN


//admin

const adminLoginDataVerify = async (req, res) => {
    try {
        // using destructuring of body data.
        const { email, password } = req.body;

        //Input data validation
        let msgUserData = isValideAdminLogin(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const isEmailUnique = await adminModel.findOne({ email: email });
        if (!isEmailUnique) {
            return res.status(400).send({ status: false, message: `Please enter a valid email address.` });
        }

        if (isEmailUnique.role !== 'Admin') {
            return res.status(403).send({ status: false, massage: 'Invalid Credentils...!!' })
        }

        //Create user data after format fname, lname, companyName
        // const comparePassword = await bcrypt.compare(password, isEmailUnique.password);
        // if (!comparePassword) {
        //     return res.status(400).send({ status: false, massage: 'Invalid Credentils...!!7' })
        // }

        return res.status(200).send({ status: true, message: 'Admin login data verify' })

    } catch (error) {
        return res.status(500).send({ status: false, message: 'Verification failed, please try again.' })
    }
}

const loginAdmin = async (req, res) => {
    try {

        // using destructuring of body data.
        const { email, password, secretotp } = req.body;

        //Input data validation
        let msgUserData = isValideAdminLogin(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const isEmailUnique = await adminModel.findOne({ email: email });
        if (!isEmailUnique) {
            return res.status(400).send({ status: false, message: `Please enter a valid email address.` });
        }

        if (isEmailUnique.role !== 'Admin') {
            return res.status(403).send({ status: false, massage: 'Invalid Credentils...!!' })
        }

        let adminMetaData = await userMetaModel.findOne({ userId: isEmailUnique._id });
        if (!adminMetaData) {
            return res.status(403).send({ status: false, massage: 'User meta data not found' })
        }


        // Verify the OTP
        const isOTPValid = speakeasy.totp.verify({
            secret: adminMetaData.is2fasecret,
            encoding: 'base32',
            token: secretotp,
        });

        if (!isOTPValid) {
            return res.status(401).send({ status: false, message: 'Invalid OTP' });
        }

        // console.log(isEmailUnique)

        //Create user data after format fname, lname, companyName
        // const comparePassword = await bcrypt.compare(password, isEmailUnique.password);
        // if (!comparePassword) {
        //     return res.status(400).send({ status: false, massage: 'Invalid Credentils...!!7' })
        // }
        // console.log(comparePassword)

        let obj = {}
        obj.fname = isEmailUnique.fname
        obj.lname = isEmailUnique.lname
        obj.companyName = isEmailUnique.companyName
        obj.email = email
        obj.role = isEmailUnique.role
        let Data = {}
        Data.role = isEmailUnique.role
        Data.curTeam = isEmailUnique.curTeam
        obj.adminId = isEmailUnique._id
        Data.adminId = isEmailUnique._id

        // console.log(obj)

        // Create json wab token
        let token = jwt.sign(obj, privateKey, { expiresIn: '8h' });
        Data.token = token

        return res.status(200).send({ status: true, message: 'Login successful', data: Data })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//user



const loginUser = async (req, res) => {
    try {
        // using destructuring of body data.
        const { email, password, rc_token, userHistory } = req.body;
        console.log(req.body)


        //Input data validation
        let msgUserData = isValideAdminLogin(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const isEmailUnique = await adminModel.findOne({ email });
        if (!isEmailUnique) {
            return res.status(400).send({ status: false, message: `Please enter a valid email address.` });
        }
        // console.log(isEmailUnique)

        let message = await recaptcharVerify(rc_token)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }

        let userMetaData = await userMetaModel.findOne({ userId: isEmailUnique._id });
        let userHistoryS = await userHistoryModel.findOne({ userId: isEmailUnique._id })



        // Create user data after format fname, lname, companyName
        const comparePassword = await bcrypt.compare(password, isEmailUnique.password);
        // if (!comparePassword) {
        //     return res.status(400).send({ status: false, massage: 'Invalid Credentils...!!' })
        // }
        // console.log(comparePassword)

        // sessionToken
        // if (userMetaData && userMetaData.sessionToken) {
        //     let decodedToken = jwt.verify(String(userMetaData.sessionToken), process.env.privateKey, { ignoreExpiration: true })
        //     if (decodedToken.exp > Date.now() / 1000) {
        //         return res.status(401).send({ status: false, message: `Any user alredy login on this ip: ${userHistoryS.ip}` });
        //     }
        // }

        let obj = {}
        obj.fname = isEmailUnique.fname
        obj.lname = isEmailUnique.lname
        obj.companyName = isEmailUnique.companyName
        obj.email = email
        obj.role = isEmailUnique.role
        let Data = {}
        Data.role = isEmailUnique.role
        Data.curTeam = isEmailUnique.curTeam

        if (isEmailUnique.role === 'Admin') {
            obj.adminId = isEmailUnique._id
            Data.adminId = isEmailUnique._id
        } else {
            obj.userId = isEmailUnique._id
            Data.userId = isEmailUnique._id
        }
        // console.log(obj)

        // Create json wab token
        let token = jwt.sign(obj, privateKey, { expiresIn: '8h' });
        Data.token = token

        // usermetaModel

        if (userMetaData) {
            await userMetaModel.findOneAndUpdate({ userId: obj.userId }, { sessionToken: token }, { new: true });
        }

        // userHistory
        userHistory.userId = isEmailUnique._id.toString()
        let newHistory = await userHistoryModel.create(userHistory)

        return res.status(200).send({ status: true, message: 'Login successful', data: Data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const ReloginUser = async (req, res) => {
    try {
        let data = req.body

        const isEmailUnique = await adminModel.findOne({ email: data.email });

        let Data = {}
        Data.role = isEmailUnique.role
        Data.curTeam = isEmailUnique.curTeam
        Data.userId = isEmailUnique._id
        let token = jwt.sign(data, privateKey, { expiresIn: '8h' });
        Data.token = token


        return res.status(200).send({ status: true, message: 'Your are re login', data: Data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : GET

const getUser = async (req, res) => {
    try {
        let data = await adminModel.find({});
        // console.log(data)
        let datas = data.filter(e => e.role !== 'Admin')
        return res.status(200).send({ status: true, message: "user data get successfully", data: datas })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// METHOD : UPDATE

const updateUser = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        let { fname, lname, companyName, email, adminId, password, currentPassword,
            newPassword, confirmPassword, teamId } = data;
        // console.log(adminId)

        const oldata = await adminModel.findOne({ _id: adminId })
        if (!oldata) {
            return res.status(400).send({ status: false, message: "Data Not Found" })
        }
        // console.log(oldata)

        //Input data validation

        if (email) {
            const isEmailUnique = await adminModel.find({ email });
            if (isEmailUnique.length > 1) {
                return res.status(400).send({ status: false, message: `This email address is already registered.` });
            }
        }
        if (currentPassword) {
            const comparePassword = await bcrypt.compare(currentPassword, oldata.password);
            if (!comparePassword) {
                return res.status(403).send({ status: false, message: 'Invalid Credentils...!!' })
            }
            data.password = currentPassword
        }
        if (newPassword && confirmPassword) {
            if (confirmPassword !== newPassword) {
                return res.status(400).send({ status: false, message: `password: ${newPassword} not exist` });
            }
        }


        let msgUserData = isValideUpdateAdmin(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (password) {
            hashedPassword = await bcrypt.hash(password.trim(), 10)
            data.password = hashedPassword
        }
        if (!password) {
            data.password = oldata.password
        }

        var hashedPassword
        //Create user data after format fname, lname, companyName
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password.trim(), 10)
            data.password = hashedPassword
        }

        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword.trim(), 10)
            data.password = hashedPassword
        }


        // console.log(data);
        await adminModel.findOneAndUpdate({ _id: adminId }, data, { new: true });
        return res.status(200).send({ status: true, message: "User updated successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// METHOD : DELETE

const deleteUser = async (req, res) => {
    try {
        // using destructuring of body data.
        let Id = req.headers.id
        let adminId = req.admin
        // console.log(Id)

        //Input data validation
        const isUnique = await adminModel.findOne({ _id: Id, adminId: adminId });
        if (!isUnique) {
            return res.status(404).send({ status: true, message: "User profile not found" });
        }

        await adminModel.findOneAndDelete({ _id: Id })
        return res.status(200).send({ status: true, message: "User profile is deleted" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// METHOD : FORGOT PASSWORD

const forgotPassword = async (req, res) => {
    try {
        let data = req.body;
        let { email, rc_token } = data

        if (!email) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }

        let emailMessage = isValidEmail(email)
        if (emailMessage) {
            return res.status(400).send({ status: false, message: 'Invalid email address' })
        }

        let isUniqueEmail = await adminModel.findOne({ email: email })
        if (!isUniqueEmail) {
            return res.status(404).send({ status: false, message: `email: ${email} not exist` })
        }

        let obj = {}
        obj.email = isUniqueEmail.email

        if (isUniqueEmail.role === 'Admin') {
            obj.adminId = isUniqueEmail._id
        } else {
            obj.userId = isUniqueEmail._id
        }

        let message = await recaptcharVerify(rc_token)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }

        // Create json wab token
        let token = jwt.sign(obj, privateKey, { expiresIn: 20 * 60 });

        const link = `${BASE_URL}/reset-password/${token}`
        await sendEmail(email, "Password reset", link);

        return res.status(200).send({ status: true, message: 'password forget' })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





const passwordReset = async (req, res) => {
    try {
        let data = req.body
        let { password, confirmPassword, rc_token } = data

        const Id = req.Id

        if (mongoose.Types.ObjectId.isValid(Id) == false) {
            return res.status(400).send({ status: false, message: "Invalid credentials" });
        }


        let message = await recaptcharVerify(rc_token)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }


        let isUnique = await adminModel.findOne({ _id: Id })
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "User profile not found" });
        }

        let passMessage = isValidpass(password)
        if (passMessage) {
            return res.status(404).send({ status: false, message: passMessage });
        }

        if (confirmPassword !== password) {
            return res.status(400).send({ status: false, message: "Make sure password and confirm password are same." });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10)

        await adminModel.findByIdAndUpdate({ _id: Id }, { password: hashedPassword }, { new: true })
        return res.status(200).send({ status: true, message: "password is updated" });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const redirectUser = async (req, res) => {
    try {
        let { fname, lname, companyName, role, email, password, userId } = req.body
        console.log(req.body)

        let isUnique = await adminModel.findOne({ email: email })
        if (!isUnique) {
            return res.status(404).send({ status: false, message: "User profile not found" });
        }

        // if (password !== isUnique.password) {
        //     return res.status(400).send({ status: false, message: "password is not match" });
        // }

        let token = jwt.sign({
            fname: fname, lname: lname, companyName: companyName, role: role,
            userId: userId, email: email, password: password
        }, privateKey, { expiresIn: "8h" });
        return res.status(200).send({ status: true, message: "useris redirect", data: `${BASE_URL}/redirect/${token}` });
        // return res.status(302).redirect(`http://localhost:3001/redirect/${token}`);

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getQrCodes = async (req, res) => {
    try {
        let { adminId, url, mode } = req.body

        let adminData = await adminModel.findOne({ userId: adminId })
        if (!adminData) {
            return res.status(400).send({ status: false, message: "Invalid input data" })
        }


        if (mode === 'faAuth') {
            
            // Generate a new secret key for the user
            const secret = speakeasy.generateSecret({ length: 6 });

            // Generate the QR code for the user to scan with their authenticator app
            QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error generating QR code' });
                } else {
                    return res.status(200).send({ status: true, message: "generating QR code", secret: secret.base32, qrCode: dataUrl })
                }
            });
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





const adminTotpVerify = async (req, res) => {
    try {
        let { adminId, url, authOtp, secret } = req.body;

        let adminData = await adminModel.findOne({ userId: adminId })
        if (!adminData) {
            return res.status(400).send({ status: false, message: "Invalid admin data" })
        }

        let adminMetaData = await userMetaModel.findOne({ userId: adminId })

        // Verify the OTP
        const isOTPValid = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: authOtp,
        });

        if (!isOTPValid) {
            return res.status(401).send({ status: false, message: 'Invalid OTP' });
        }



        if (adminMetaData) {
            let updateAdminData = await userMetaModel.findOneAndUpdate({ userId: adminId }, { is2fasecret: secret }, { new: true })

            return res.status(200).send({ status: true, message: 'Verified successfully' });

        } else if (!adminMetaData) {
            let obj = {
                userId: adminId,
                isActive: true,
                validate: '50',
                isActive2fa: true,
                is2fasecret: secret
            }
            await userMetaModel.create(obj)

            return res.status(200).send({ status: true, message: 'Verified successfully' });

        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const googleLogins = async (req, res) => {
    try {
        let { fname, lname, companyName, role, plan, teamName, userUrl, prices, email, issSignIn, password, rc_token, userHistory } = req.body;

        const isEmailUnique = await adminModel.findOne({ email });

        let message = await recaptcharVerify(rc_token)
        if (message) {
            return res.status(400).send({ status: false, message: message });
        }

        if (!isEmailUnique) {
            //Create user data after format fname, lname, companyName
            const userData = {
                fname: fname.trim(),
                lname: lname.trim(),
                companyName: companyName.trim(),
                role: role,
                issSignIn: issSignIn,
                email: email.toLowerCase().trim(),
                password: '',
            };

            const newUser = await adminModel.create(userData);

            if (newUser) {
                const userMeta = {
                    userId: newUser._id,
                    isActive: true,
                    plan: plan,
                    validate: '14',
                    userUrl: userUrl
                }
                await userMetaModel.create(userMeta);
            }

            if (newUser) {
                let userDatas = {
                    team_name: teamName,
                    userId: newUser._id
                };
                let resData = await teamModel.create(userDatas);
                if (resData && Object.keys(resData).length > 0) {
                    let cuNewRoles = []
                    let DRoles = ['Circle Lead', 'Project Lead', 'Domain Owner', 'Link Owner', 'Mentor']
                    for (let j = 0; j < DRoles.length; j++) {
                        let rObj = {
                            teamId: resData._id, 
                            roleName: DRoles[j],
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
                            purpose: '', tasks: [], owners: { type: curRoles._id, owner: null },
                            standIn: null, tags: []
                        }
                        let resDomain = await domainModel.create(dDomain)
                        if (resDomain && Object.keys(resDomain).length > 0) {
                            let uRole = {
                                domains: [{ domain: resDomain._id, owner: null }]
                            }
                            await roleModel.findOneAndUpdate({ _id: curRoles._id }, uRole, { new: true })
                        }
                    }

                }
            }

        }


        const isEmailUniques = await adminModel.findOne({ email });

        if (isEmailUniques && !isEmailUniques.issSignIn) {
            return res.status(404).send({ status: false, message: 'Please enter a valid email address.' })
        }

        let userMetaData = await userMetaModel.findOne({ userId: isEmailUniques._id });
        let userHistoryS = await userHistoryModel.findOne({ userId: isEmailUniques._id })

        // sessionToken
        // if (userMetaData && userMetaData.sessionToken) {
        //     let decodedToken = jwt.verify(String(userMetaData.sessionToken), process.env.privateKey, { ignoreExpiration: true })
        //     if (decodedToken.exp > Date.now() / 1000) {
        //         return res.status(401).send({ status: false, message: `Any user alredy login on this ip: ${userHistoryS.ip}` });
        //     }
        // }

        let obj = {}
        obj.fname = isEmailUniques.fname
        obj.lname = isEmailUniques.lname
        obj.companyName = isEmailUniques.companyName
        obj.email = email
        obj.role = isEmailUniques.role
        let Data = {}
        Data.role = isEmailUniques.role
        Data.curTeam = isEmailUniques.curTeam

        if (isEmailUniques.role === 'Admin') {
            obj.adminId = isEmailUniques._id
            Data.adminId = isEmailUniques._id
        } else {
            obj.userId = isEmailUniques._id
            Data.userId = isEmailUniques._id
        }
        // console.log(obj)

        // Create json wab token
        let token = jwt.sign(obj, privateKey, { expiresIn: '8h' });
        Data.token = token

        // usermetaModel


        if (userMetaData) {
            await userMetaModel.findOneAndUpdate({ userId: obj.userId }, { sessionToken: token }, { new: true });
        }

        // userHistory
        userHistory.userId = isEmailUniques._id.toString()
        let newHistory = await userHistoryModel.create(userHistory)

        return res.status(200).send({ status: true, message: 'Login successful', data: Data })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = {
    createUser, registerUser, ReloginUser, userVerify, paymentVerify, loginUser, adminTotpVerify, getUserMetaData,
    loginAdmin, getUser, updateUser, deleteUser, forgotPassword, passwordReset, redirectUser, getQrCodes, adminLoginDataVerify,
    getUserAndMetaData, googleLogins
}
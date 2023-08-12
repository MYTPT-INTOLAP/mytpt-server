const axios = require('axios')
const stripe = require('stripe')('sk_test_51MTPGBLkNe67mta9IuzVjbV78MWFlhGD6rEClMjy5FcA0C9C7GgvFh1ow6q5GamDfpejjT8F469RoSbsXFSrBuBs004HfSOZAw');
const userMetaModel = require('../models/Admin_Model/userMeta')


const createAdminData = async (req, res) => {
    try {
        let { data } = await axios.get('https://staged.mytpt.work/wp-json/wp/users')
        // console.log(data)

        let userDatas = []
        var newprice
        var newplan
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const userData = {
                    fname: data[i].meta.first_name[0] ? data[i].meta.first_name[0] : null,
                    lname: data[i].meta.last_name[0] ? data[i].meta.last_name[0] : null,
                    companyName: data[i].meta && data[i].meta.mytpt_company_name && data[i].meta.mytpt_company_name[0] ? data[i].meta.mytpt_company_name[0] : null,
                    role: 'User',
                    email: data[i].user_email ? data[i].user_email : null,
                    password: data[i].user_pass ? data[i].user_pass : null,
                };
                // userDatas.push(userData);
                let newUser = {}


                if (data[i].meta && data[i].meta) {
                    if (data[i].meta.mytpt_session_id && data[i].meta.mytpt_session_id[0] != '' && data[i].meta.mytpt_session_id[0] != null
                        && data[i].meta.mytpt_session_id[0] != 'free_trial' && data[i].meta.mytpt_session_id[0] != 'consulting') {
                        const session = await stripe.checkout.sessions.retrieve(
                            data[i].meta.mytpt_session_id[0]
                        );

                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription
                        );

                        newprice = await stripe.products.retrieve(
                            subscription.items.data[0].plan.product
                        );

                       res.status(200).send({ status: true, message: 'all users', data: newprice })

                    } else if (data[i].meta.mytpt_session_id && (data[i].meta.mytpt_session_id === '' || data[i].meta.mytpt_session_id === null)) {
                        newplan = 'FTrial'
                    }
                }



                if (newUser) {
                    // const userMeta = {
                    //     userId: newUser._id,
                    //     isActive: true,
                    //     plan: plan,
                    //     validate: '30',
                    //     userUrl: userUrl
                    // }
                    // await userMetaModel.create(userMeta);
                }

                // if (newUser) {
                //     let userDatas = {
                //         team_name: teamName,
                //         userId: newUser._id
                //     };
                //     let resData = await teamModel.create(userDatas);
                //     if (resData && Object.keys(resData).length > 0) {
                //         let cuNewRoles = []
                //         let DRoles = ['Circle Lead', 'Project Lead', 'Domain Owner', 'Link Owner', 'Mentor']
                //         for (let j = 0; j < DRoles.length; j++) {
                //             let rObj = {
                //                 teamId: resData._id, roleName: DRoles[j],
                //                 purpose: '', tasks: [],
                //                 owners: [], domains: [],
                //                 tags: [], defaultRole: true
                //             }
                //             cuNewRoles.push(rObj)
                //         }
                //         if (cuNewRoles.length > 0 && cuNewRoles.length === DRoles.length) {
                //             await roleModel.insertMany(cuNewRoles)
                //         }
                //         let dMeetings = {
                //             teamId: resData._id,
                //             meetingsName: 'Governance Meeting',
                //             meetingsPurpse: '',
                //             recurrence: '',
                //             duration: '',
                //             defaultMeeting: true
                //         }
                //         let newMeeting = await meetingModel.create(dMeetings)
                //         if (newMeeting && Object.keys(newMeeting).length > 0) {
                //             let dCircles = {
                //                 teamId: resData._id,
                //                 circleName: 'Team Circle', defaultCircle: true,
                //                 purpose: '', tasks: [], lead: null, leadToDos: [],
                //                 meetings: [newMeeting._id], standIn: null, administration: [], tags: []
                //             }
                //             let cres = await circleModel.create(dCircles)
                //         }
                //         let dRole = {
                //             teamId: resData._id, roleName: 'Governance moderator',
                //             purpose: 'kxfjngvljnfdvgnd', tasks: ['djfbsdyhfsdf', 'sufygsuydhfisdif'],
                //             owners: [], domains: [],
                //             tags: [], defaultRole: true
                //         }
                //         let curRoles = await roleModel.create(dRole)
                //         if (curRoles && Object.keys(curRoles).length > 0) {
                //             let dDomain = {
                //                 teamId: resData._id,
                //                 domainName: 'mytpt', defaultDomain: true,
                //                 purpose: '', tasks: [], owners: { type: curRoles._id, owner: null },
                //                 standIn: null, tags: []
                //             }
                //             let resDomain = await domainModel.create(dDomain)
                //             if (resDomain && Object.keys(resDomain).length > 0) {
                //                 let uRole = {
                //                     domains: [{ domain: resDomain._id, owner: null }]
                //                 }
                //                 await roleModel.findOneAndUpdate({ _id: curRoles._id }, uRole, { new: true })
                //             }
                //         }
                //     }
                // }
            }
        }

        // 'cs_test_a1wGcjh4F2s2MDKAtSx6OJbs1BYa4MKHMWbwJYzWZ4j2CijWJIaLleJJS6'

        // const session = await stripe.checkout.sessions.retrieve(
        //     'cs_test_a1wGcjh4F2s2MDKAtSx6OJbs1BYa4MKHMWbwJYzWZ4j2CijWJIaLleJJS6'
        // );

        // const subscription = await stripe.subscriptions.retrieve(
        //     session.subscription
        // );

        // const products = await stripe.products.retrieve(
        //     subscription.items.data[0].plan.product
        // );


        // const price = await stripe.prices.retrieve(
        //     subscription.items.data[0].plan.id
        // );




        //   const invoice = await stripe.invoices.retrieve(
        //     subscription.latest_invoice
        //   );


        // console.log(session)


        // return res.status(200).send({ status: true, message: 'all users', data: data })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



module.exports = { createAdminData }
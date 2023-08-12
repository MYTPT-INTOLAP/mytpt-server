const stripe = require('stripe')('sk_test_51MTPGBLkNe67mta9IuzVjbV78MWFlhGD6rEClMjy5FcA0C9C7GgvFh1ow6q5GamDfpejjT8F469RoSbsXFSrBuBs004HfSOZAw');
const adminMetaModel = require('../../models/Admin_Model/userMeta')

const getAllProducts = async (req, res) => {
    try {
        const products = await stripe.products.list({ active: true });
        const prices = await stripe.prices.list({ active: true });
        // console.log(products)
        // console.log(prices)
        let data = [];

        let arr = ["Free Trial", "Company License", "Freelancer License", "Consulting"]

        if (products && products.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < products.data.length; j++) {
                    if (arr[i] === products.data[j].name) {
                        data.push(products.data[j])
                    }
                }
            }
        }

        let Onboarding = []

        if (products && products.data.length > 0) {
            for (let j = 0; j < products.data.length; j++) {
                if (products.data[j].name === 'Onboarding') {
                    Onboarding.push(products.data[j])
                }
            }
        }

        // console.log(Onboarding)

        return res.status(200).send({ status: true, message: 'products', data: data, Onboarding: Onboarding, prices: prices.data });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





let getProductInvoic = async (req, res) => {
    try {
        let { adminid } = req.headers

        let adminMetaData = await adminMetaModel.findOne({ userId: adminid })

        if (!adminMetaData) {
            return res.status(404).send({ status: false, message: 'Admin meta data note found' })
        }
        const session = await stripe.checkout.sessions.retrieve(adminMetaData.session_id);

        if (!session) {
            return res.status(404).send({ status: false, message: 'Invalid session id' })
        }
        const invoices = await stripe.invoices.list({ customer: session.customer });
        // const invoice = await stripe.invoices.retrieve(session.invoice);

        return res.status(200).send({ status: false, message: "User product invoic get", data: invoices })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const deleteSubscription = async (req, res) => {
    try {
        let { subid } = req.headers
        console.log(subid)

        if (!subid) {
            return res.status(404).send({ status: false, message: 'Input subscription id required' })
        }

        const deleted = await stripe.subscriptions.cancel(subid);

        return res.status(200).send({ status: false, message: "Subscription is deleted" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const getSubscription = async (req, res) => {
    try {
        let { adminid } = req.headers

        let adminMetaData = await adminMetaModel.findOne({ userId: adminid })

        if (!adminMetaData) {
            return res.status(404).send({ status: false, message: 'Admin meta data note found' })
        }
        const session = await stripe.checkout.sessions.retrieve(adminMetaData.session_id);

        if (!session) {
            return res.status(404).send({ status: false, message: 'Invalid session id' })
        }

        const subscriptions = await stripe.subscriptions.list({ customer: session.customer });

        return res.status(200).send({ status: false, message: "subscription", data: subscriptions })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { getAllProducts, getProductInvoic, deleteSubscription, getSubscription }
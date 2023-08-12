const nodemailer = require("nodemailer");


const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'cpanel-003-fra.hostingww.com',
            port: 465,
            secure: true,
            auth: {
                user: 'app@mytptmail.work',
                pass: 'tVDT21%P5!q~',
            },
        });

        await transporter.sendMail({
            from: 'app@mytptmail.work',
            to: email,
            subject: subject,
            text: text
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = {sendEmail};
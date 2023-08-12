const { promisify } = require('util');
const request = promisify(require('request'));




const recaptcharVerify = async(rc_token)=>{
    const response_key = rc_token
    const secret_key = "6LeeB-MlAAAAAKFTuW1yDAaRf7J0v9RUAc4s6AUm";
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }

    const re = await request(options);
    if (!JSON.parse(re.body)['success']){
        return  'Invalid request'
    }
}



module.exports = {recaptcharVerify}
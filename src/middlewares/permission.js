const data = require("../Config/keys")


const permission = (req, res, next)=>{
    let role = req.Role
    let userId = req.admin
    // console.log(role);
    let url = ''
    url = req.body.url
    if(!url){
        url = req.headers.url
    }
    // console.log(data.ADMIN);
    let flag = false
    if(role === 'Admin' && data && data.ADMIN.length > 0){
        for(let i = 0; i < data.ADMIN.length; i++){
            console.log((`${data.SERVER_URI}` + `${data.ADMIN[i]}` === url))
            if (`${data.SERVER_URI}` + `${data.ADMIN[i]}` === url) {
                flag = true
                break;
            }
        }

    }else if(role === 'User'  && data && data.USER && data.USER.length > 0){
        for(let i = 0; i < data.USER.length; i++){
            if (`${data.SERVER_URI}` + `${data.USER[i]}` === url) {
                flag = true
                break;
            }
        }
    }
    if(!flag){
        return res.status(403).send({status: false, message: `unauthorized access....!!${data.ADMIN , data.SERVER_URI, url}` }) 
    }
    // console.log(typeof role);
    next()
}



module.exports = {permission}
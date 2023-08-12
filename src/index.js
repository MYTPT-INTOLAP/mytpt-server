const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dbConnection = require('./db_connection/mongodb')
const AdminRoutes = require('./routes/admin')
const TeamRoutes = require('./routes/team')
const UserRoutes = require('./routes/user')
const cors = require('cors')
require('dotenv').config()



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())



//Database connection
dbConnection()


//all routes
app.use('/admin', AdminRoutes)
app.use('/team', TeamRoutes)
app.use('/user', UserRoutes)


//vercel 

// if (process.env.NODE_ENV == 'production') {
//     const path = require('path')
//     app.use(express.static(path.join(__dirname, "../client/build")));

//     app.get("*", function (_, res) {
//         res.sendFile(
//             path.join(__dirname, "../client/build/index.html"),
//             function (err) {
//                 if (err) {
//                     res.status(500).send(err)
//                 }
//             }
//         )
//     })
// }



app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Express running with port...${process.env.PORT || 5000}`)
})
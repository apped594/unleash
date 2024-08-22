require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors") // Only when testing usimng forntend api
const path = require("path") // to server static files and use path to make sure it will work on other servers as well
const port = process.env.PORT || 9000 // Use a PORT var in .ev otherwise use port 8000
const connectDb = require("./db/connect")
const notFound = require("./middleware/notFound")
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware")  // Handles all our other errors form 404 to 500

const authRouter = require("./routes/auth")
const authMiddleware = require("./middleware/authMiddleware")
const jobsRouter = require("./routes/jobs")
const profileRouter = require("./routes/profile")
const userAngelsRouter = require("./routes/userAngels")


const sendOTP = require("./middleware/otpMiddleware")
const sendPanicSMS = require("./middleware/sendPanicSMS")

app.use(cors())
app.use(express.json()) // should handle any json object from the body

//Routes

app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/v1/otp",sendOTP)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/profile",authMiddleware,profileRouter)
app.use("/api/v1/userAngels",authMiddleware,userAngelsRouter) 
app.use("/api/v1/jobs",authMiddleware,jobsRouter)
app.use("/api/v1/sendPanicSMS", authMiddleware, sendPanicSMS);
// Protect the home route with authentication middleware

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async()=>{
    try {
        await connectDb(process.env.Mongo_URI)
        console.log("db connected")
        app.listen(port,console.log(`Server is listening on ${port}...`))
        
    } catch (error) {
        console.log(error)
    }
}

start()
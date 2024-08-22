const express = require("express") //Import express so we can create a router
const jobsRouter = express.Router()  // create your router
const {      // use destructering to import and asign all the controller fucntions to variables
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}  = require("../controllers/jobs")

jobsRouter.get("/",getJobs).post("/",createJob)      // setup our routes
jobsRouter.get("/:id",getJob).patch("/:id",updateJob).delete("/:id",deleteJob)

module.exports = jobsRouter  // export our router so we can use it in app.js
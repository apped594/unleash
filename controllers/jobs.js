const asyncWrapper = require("../middleware/asyncWrapper")
const {createCustomError} = require("../errors/customErrors")
const jobModel = require("../models/jobs")


const getJobs = asyncWrapper(async(req,res)=>{

    const job = await jobModel.find({createdBy: req.user.userId}).sort("createdAt")
    
    res.status(200).json({ job })

})

const getJob = asyncWrapper(async(req,res,next)=>{

    const {user:{userId},params:{id:jobId}} = req

    const job = await jobModel.findOne({_id:jobId,createdBy:userId}) /// imprtant to use findOne method and not Find otherwise the jobs object will contain the user info

   if (!job) {

    return next(createCustomError(`No Job with id:${jobId} found`, 404))

   }

    res.status(200).json({job})

})

const createJob = asyncWrapper(async(req,res,next)=>{

    req.body.createdBy = req.user.userId  // need to add the createdBy property to the object we will be sending to mongoose when creating the job. 
    

    const job = await jobModel.create(req.body)

    res.status(201).json({ job })

})

const updateJob = asyncWrapper(async(req,res,next)=>{

    const {name,jobDescription} = req.body

    if (!name || !jobDescription){

        return next(createCustomError("Please provide name and Job description",400))
    }

    const {user:{userId},params:{id:jobId}} = req

    const job = await jobModel.findOneAndUpdate({_id:jobId,createdBy: userId},req.body,{new : true, runValidators : true})

     if (!job){
        
        return next(createCustomError(`No Job with id:${jobId} found`, 404))
    }
    res.status(200).json({ job })

})

const deleteJob = asyncWrapper(async(req,res,next)=>{

    const {user:{userId}, params:{id:jobId}} = req

    const job =  await jobModel.findOneAndDelete({createdBy: userId, _id: jobId})

    if (!job){
        
        return next(createCustomError(`No Job with id:${jobId} found`, 404))
    }

    res.status(200).json(`job: ${jobId}`)

})



module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
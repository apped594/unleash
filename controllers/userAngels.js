const asyncWrapper = require("../middleware/asyncWrapper")
const {createCustomError} = require("../errors/customErrors")
const userAngelsModel = require("../models/userAngels")

const getAngels = asyncWrapper(async(req,res,next)=>{

    const angels = await userAngelsModel.find({createdBy: req.user.userId})


    res.status(200).json({ angels })
})

const createAngels = asyncWrapper(async(req,res,next)=>{

    req.body.createdBy = req.user.userId

    const angel = await userAngelsModel.create(req.body)
    res.status(201).json({ angel })

})

const updateAngels = asyncWrapper(async(req,res,next)=>{

    const {displayName, contactNumber} = req.body

    if(!displayName || !contactNumber) {

        return next(createCustomError("Please provide display name and contact number",400))
    }

    const {user:{userId}, params:{id:angelId}}= req

    const angel = await userAngelsModel.findOneAndUpdate({_id:angelId,createdBy: userId},req.body,{new:true, runValidators:true})

    res.status(200).json({ angel })
})

const deleteAngels = asyncWrapper(async(req,res,next)=>{

    const {user:{userId}, params:{id:angelId}} = req
    
    const angel = await userAngelsModel.findOneAndDelete({_id:angelId, createdBy:userId})

    res.status(200).json(`angel: ${angelId} deleted`)

})

const getAngel = asyncWrapper(async(req,res,next)=>{

    const {user:{userId},params:{id:angelId}} = req

    const angel =  await userAngelsModel.findOne({_id:angelId, createdBy:userId})

    if (!angel) {

        return next(createCustomError(`No angel with id:${angelId} found`, 404))
    
       }

    res.status(200).json({ angel })
})

module.exports = {
    getAngels,
    createAngels,
    updateAngels,
    getAngel,
    deleteAngels
}
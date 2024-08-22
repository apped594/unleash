const asyncWrapper = require("../middleware/asyncWrapper")
const {createCustomError} = require("../errors/customErrors")
const userModel = require("../models/users")

const getUser = asyncWrapper(async(req,res,next)=>{

    const user = await userModel.findById(req.user.userId)

    if (!user) {
        return next(createCustomError("User not found", 404));
      }
    res.status(200).json(user)
})

const updateUser = asyncWrapper(async(req,res,next)=>{

    console.log(req.user.userId)
    console.log(req.body)
    const user = await userModel.findByIdAndUpdate(req.user.userId,req.body,{new : true, runValidators : true})

    

    if (!user){
        
        return next(createCustomError(`No Job with id:${req.user.userId} found`, 404))
    }
    res.status(200).json({ user })
    

})

module.exports = {
    getUser,
    updateUser

}
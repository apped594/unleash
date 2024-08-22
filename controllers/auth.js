const asyncWrapper = require("../middleware/asyncWrapper")
const {createCustomError} = require("../errors/customErrors")
const userModel = require("../models/users") // importing our User Model



const register = asyncWrapper(async(req,res,next)=>{

    const user = await userModel.create({...req.body})
    console.log(user)
    // creates a user using our model

    const token = user.createToken()  // we then create a token for the user that was created above

    console.log(token)

    res.status(201).json({ user:{name:user.name},token})

})



const login = asyncWrapper(async(req,res,next)=>{

    const {email,password} = req.body

    if (!email || !password) {

        return next(createCustomError("Please provide email and password", 400))
        
    }

    const user = await userModel.findOne({email})

    if (!user){

        return next(createCustomError("No user with supplied email found",401))
    }

    const isPasswordCorrect = await user.checkPassword(password)

    if (!isPasswordCorrect) {

        return next(createCustomError("Invalid Credentials",401))
    }

    const token = user.createToken()

    res.status(200).json({ user:{name:user.name},token})
   

})

module.exports = {
    login,
    register
}
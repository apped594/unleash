const asyncWrapper = require("./asyncWrapper")

const sendOTP = asyncWrapper(async(req,res,next)=>{

    const {OTP} = req.body
    console.log({"OTP":OTP})

})

module.exports = sendOTP
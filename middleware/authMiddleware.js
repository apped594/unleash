const jwt = require("jsonwebtoken")
const {createCustomError} = require("../errors/customErrors")

const authMiddleware = async (req,res,next) =>{

    const authHeaders = req.headers.authorization

    if (!authHeaders || !authHeaders.startsWith("Bearer")) {

        return next(createCustomError("Not a valid token request", 401))

    }

    const token = authHeaders.split(" ")[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_Secret)

        const {userId, name} = decoded

        req.user = {userId,name}
        console.log(req.user)

        next()
        
    } catch (error) {

        return next(createCustomError("Token Not Authorized",401))
        
    }


}

module.exports = authMiddleware
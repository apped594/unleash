// const {customAPIerror} = require("../errors/customErrors") // we import the new custom class, becasue we want to see if the error object that gets passed to this middleware is an instance of the new custom class.

//If it is we respond by sending the error message and status form this object, otherwise we jsut send the generic 500 error status code with the generic error object

const errorHandlerMiddleware = (err,req,res,next) =>{ //The err param makes it that it gets reconised as error middelware and not just normal middelware
    
    let customError ={   // for more userfriendly mongo error messages
        //set default
        statusCode: err.statusCode || 500,
        msg: err.message || "Something went wrong try again later"

    }

    
    // if (err instanceof customAPIerror){
    //     return  res.status(err.statusCode).json({msg:err.message}) // We simply return the error status and message form our custom error object
    // }  --- We odn't need anymore because we are handeling it in the custom error object our cusotm error will be in the erro object with its own status code we provided upon creating it


//Check for duplicate values
    if (err.code && err.code === 11000) {

        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field`
        customError.statusCode = 400

    }

    if (err.name ==="CastError") {  /// incorrect tokens or syntax

        customError.msg = `No item found with id: ${err.value}`
        customError.statusCode = 404
    }

    //Check for validationerror form mongoose and return more user friendly version to client

    // if (err.name === "ValidationError"){
    //     customError.msg = "Validation Error: " + Object.values(err.errors)
    //     .map((item)=>{item.message.join(",")})
    //     customError.statusCode = 400

    //     console.log(customError.msg)
    // } - we ar ehandling this in our auth controller so thi si s not needed

    // return res.status(500).json({err})
    return res.status(customError.statusCode).json({msg: customError.msg})

}

module.exports = errorHandlerMiddleware
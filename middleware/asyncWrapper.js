const asyncWrapper = (fn)=>{ //higher order function that passes our fn down and it returns a function that matches the middleware signature, we need to have middleware in order to apply this to all our controllers when we wrap them so we can hanlde the try catch here. 

    return async(req,res,next)=>{  //creates middleware wrapper

        try {
         await fn(req,res,next)  //tries to excecute our controller function and end the req-res cycle
        } catch (error) {  //catches any errors
            next(error)  //passes the error on to another middleware to handle the errors
        }

    }

}

module.exports = asyncWrapper
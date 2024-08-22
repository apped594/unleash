class customAPIerror extends Error{    // Extend form the original Error class
    constructor(message,statusCode) {  //invoke the contructor method
        super(message)      // initialize the message property form the parent/Error class to our instances
        this.statusCode = statusCode   // creates a property inour instances with the name statusCode
}
}
const createCustomError =  (msg,statusCode)=>{   // new function that creates an instance of our class
    return new customAPIerror(msg,statusCode)
}

module.exports  = {createCustomError, customAPIerror} // we export the class becasue we will be doing a comparison in the errorHandlerMiddleware
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({    //uses Constructor to create new task schema / like a recipe

    name:{
        type: String,
        required: [true,"Please provide name"],
        minlength:1,
        maxlength:50
    },

    email:{
        type: String,
        required: [true,"Please provide email"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please provide a valid email"], // here we make sure that it is a legit email
        unique: true // creates a unique index so we make sure there isn't another email like this one
    },

    password:{
        type: String,
        required: [true,"Please provide password"],
        minlength:5,
    },

    contactNumber:{
        type: String,
        default: "",
        match:[/^\d{10}$/, "Please provide a valid contact number"],
        unique: true,
    },

    idNumber:{
        type: String,
        default: "",
        match:[/^\d{13}$/, "Please provide a valid contact number"],
        unique: true,
    },

    isPaidMember:{
        type: Boolean,
        default: false,
    }


})

userSchema.pre("save", async function(next){   // We do this so that we can hashg the password when a user gets created, so we do this directly in our userModel file.

    const salt = await bcryptjs.genSalt(10)  // generate random bytes
    this.password = await bcryptjs.hash(this.password,salt)  // make sure that the instance that will be created that it's password gets hashed hence the keyword this, we also need to use the function keyword instead of the arrow functions so we make sure the context of the this stays local to our document
    next() //passing the info on to our next middleware
})

userSchema.methods.createToken = function(){  // Instance methods that we can use. this method will create a jwt token for us instead of having to add the code inour register controller.

   return jwt.sign({userId:this._id, name:this.name},process.env.JWT_Secret,{expiresIn:process.env.JWT_Life}) 

}

userSchema.methods.checkPassword = async function(incommingpassword){

const isMatch = await bcryptjs.compare(incommingpassword,this.password)
return isMatch
}

module.exports = mongoose.model("User",userSchema) ///creates model / cheff that interacts with the cookies using the recipe as guide on how to interact
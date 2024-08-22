const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please provide a name"],
        maxlength:50,
    },
    jobDescription:{
        type: String,
        required: [true,"Please proved a description"]

    },
    status:{
        type: String,
        enum:["requested", "active", "completed"],
        default:"requested"
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        require:[true,"Please provide a user"]
    },
    

},{timestamps:true})

module.exports = mongoose.model("Job",jobSchema)
const mongoose = require("mongoose") // imports Mongoose that help[s us to setp and crate our DB wihtout having to do it manually on atlas

const connectDb = (url)=>{
    return mongoose.connect(url)
}

module.exports = connectDb
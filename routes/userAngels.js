const express = require("express")
const userAngelsRouter = express.Router()
const {
    getAngels,
    createAngels,
    updateAngels,
    getAngel,
    deleteAngels
} = require("../controllers/userAngels")

userAngelsRouter.get("/",getAngels).post("/",createAngels)      // setup our routes
userAngelsRouter.get("/:id",getAngel).patch("/:id",updateAngels).delete("/:id",deleteAngels)

module.exports = userAngelsRouter
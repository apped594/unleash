const express = require('express');
const {getUser,updateUser} = require('../controllers/profile');
const profileRouter = express.Router();

// Define your routes here
profileRouter.get('/', getUser).patch("/",updateUser);

module.exports = profileRouter;
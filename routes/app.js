const express = require('express');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const homeRouter = express.Router();

homeRouter.get('/home',authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../private/home.html'));
});

module.exports = homeRouter;
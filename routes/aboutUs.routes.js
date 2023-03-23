const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

/* GET home page */
router.get("/aboutUs", (req, res, next) => { res.render("about-us" , {userInSession: req.session.currentUser}) });

module.exports = router;

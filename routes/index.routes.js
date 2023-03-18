const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");

/* GET home page */
router.get("/", (req, res, next) => {

    let first, second, third
    
    Recipe.find().sort({ createdAt: -1 }).limit(6)
    .then(recentRecipes => {

        res.render("index", {recentRecipes ,
            userInSession: req.session.currentUser} );
    })
    .catch(err => next(err))

});

module.exports = router;

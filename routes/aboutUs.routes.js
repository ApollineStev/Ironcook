const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");


/* GET home page */
router.get("/aboutUs", (req, res, next) => { res.render("about-us") });

module.exports = router;

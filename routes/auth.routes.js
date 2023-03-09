const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

///// signup /////
router.get("/signup", (req, res) => res.render("auth/signup", { layout: 'to-login-layout.hbs' }));

router.post("/signup", (req, res, next) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.render("auth/signup", { layout: 'to-login-layout.hbs' }, {
          errorMessage: "All fields are mandatory. Please provide your username, email and password."
      });
      return;
  }
    
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(500).render("auth/signup", { layout: 'to-login-layout.hbs' }, {
            errorMessage:
            "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
        });
        return;
    }

    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
          return User.create({
              username,
              email,
              passwordHash: hashedPassword
          });
    })
    .then((userFromDB) => {
      res.redirect("/", { layout: 'to-login-layout.hbs' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { layout: 'to-login-layout.hbs' }, { errorMessage: error.message });
        } else if (error.code === 11000) {
        res.status(500).render("auth/signup", { layout: 'to-login-layout.hbs' }, {
            errorMessage: "Username and email need to be unique. Either username or email is already used."
        });
        } else {
        next(error);
        }  
    });
});


///// login /////
router.get('/login', (req, res, next) => res.render('auth/login', { layout: 'to-login-layout.hbs' }))

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;

    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }

    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { layout: 'to-login-layout.hbs' }, { errorMessage: 'Username is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user. passwordHash)) {
            req.session.currentUser = user;
            res.redirect("/", { layout: 'to-logout-layout.hbs' })
        } else {
          res.render('auth/login', { layout: 'to-login-layout.hbs' }, { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
});

////// user profile ///////

router.get('/userProfile', (req, res) => res.render('auth/user-profile', { layout: 'to-logout-layout.hbs' }))


/////////// log out ///////////
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/', { layout: 'to-login-layout.hbs' });
    });
});


module.exports = router;
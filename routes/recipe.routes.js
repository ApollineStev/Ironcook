const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

////// middleware  //////
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

// search a recipe (button click =>)
/* router.get('/recipes/search', (req, res) => res.render('recipes/recipe-search.hbs'));

router.get('/recipes/search/results', (req, res) => {

    const { wordToSearch } = req.query

    Recipe.find({ title: { $regex: wordToSearch } })
        .then(allRecipesFromDB => {
            res.render("recipes/recipe-search-results", { recipes: allRecipesFromDB })
        }).catch(err => console.log(err))

}); */

// create a recipe
router.get('/recipes/create', isLoggedIn, (req, res) => {
    res.render('recipes/recipe-create.hbs')
});

router.post('/recipes/create', (req, res, next) => {

    const { user, title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, image, date } = req.body;

    Recipe.create({ user, title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, image, date })
    .then(dbUser => {
        return Recipe.findByIdAndUpdate( user, { $push: { user : dbUser._id } })
    })
    .then(() => res.redirect('/userProfile')) // how to render '/recipes/:recipeId'
    .catch(error => next(error));

});

router.get('/userRecipes', isLoggedIn, (req, res, next) => {
    Recipe.find()
    .then(dbUser => {
        console.log(dbUser)
    })
    //.then(() => res.render('user/user-recipes'))
    res.render('user/user-recipes')
})



module.exports = router;

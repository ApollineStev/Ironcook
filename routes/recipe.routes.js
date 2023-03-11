const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

////// middleware  //////
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");


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
router.get('/recipes/create', isLoggedIn, (req, res) => res.render('recipes/recipe-create.hbs'));

router.post('/recipes/create', (req, res) => {

    const { title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, image, date } = req.body;

    Recipe.create({ title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, image, date })
    .then(() => res.redirect('/user-profile')) // how to render '/recipes/:recipeId'
    .catch(error => next(error));

});





module.exports = router;
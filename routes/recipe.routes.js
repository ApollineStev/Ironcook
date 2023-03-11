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
router.get('/recipe-create', isLoggedIn, (req, res) => {
    User.find()
    .then((user) => {
        res.render('recipes/create', { user })
    })
    .catch((err) => console.log(`Error while displaying page: ${err}`));
});

router.post('/recipe-create', (req, res, next) => {

    const { author, title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, imageUrl, date } = req.body;

    Recipe.create({ author, title, description, ingredients, cuisine, dishType, difficulty, timeToPrepare, imageUrl, date })
    .then((recipe) => 
        {
            console.log(recipe)
            return User.findByIdAndUpdate(author,
                { $push: { recipes: recipe._id } })
        })
    .then((recipe) => {
        res.render(`recipes/${recipe._id}`, { recipe })
    })
    .catch(error => next(error));

});


// show recipe detail
router.get('/recipe/:recipeId', (req, res, next) => { 

    const { recipeId } = req.params;

    Recipe.findById(recipeId)
    .populate('author')
    .then(recipe => {
        res.render('recipes/detail', { recipe: recipe });
    })
    .catch(error => next(error));
})


module.exports = router;
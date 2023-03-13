const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

////// middleware  //////
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

//////////////   recipe list /////////////////

router.get('/recipes', isLoggedIn, (req, res, next) => {
    Recipe.find()
    .then(recipes => {
        res.render('recipes/recipe-list', { recipe : recipes })
    })
    .catch(err => next(err))
})





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
    res.render('recipes/create', {
        userInSession: req.session.currentUser} ) 
});

router.post('/recipe-create',isLoggedIn,  (req, res, next) => {
    
   // req.session.currentUser._id = author

    const {title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date } = req.body;

    Recipe.create({title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date })
    .then((recipe) => 
        {
            console.log(recipe)
           /* return User.findByIdAndUpdate(author,
                { $push: { recipes: recipe._id } })*/
        })
    .then((recipe) => {
        res.render(`recipes/detail`, { recipe:recipe })
    })
    .catch(error => next(error));

});


// show recipe detail
router.get('/recipe/:recipeId', (req, res, next) => { 

    const { recipeId } = req.params;

    Recipe.findById(recipeId)
    .then(recipe => {
        res.render('recipes/detail', { recipe: recipe })
    })
    .catch(error => next(error));
})


module.exports = router;
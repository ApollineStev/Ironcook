const { Router } = require("express");
const router = new Router();

const axios = require('axios')

const mongoose = require("mongoose");

////// middleware  //////
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

//////////////   recipe list /////////////////

router.get('/recipes', (req, res, next) => {
    Recipe.find()
    .then(recipes => {
            res.render("recipes/recipe-list", {recipe: recipes})
    })
    .catch(err => next(err))
})

////////////////// axios test////////////////////
/*
router.get('/random', (req, res, next) => {
    const options = {
        method: 'GET',
        url: 'https://random-recipes.p.rapidapi.com/ai-quotes/1',
        headers: {
            'X-RapidAPI-Key': '3277c2f1d7msh7171818c2674ff8p12125bjsnaf08cc3db9f7',
            'X-RapidAPI-Host': 'random-recipes.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    })
    .then(response => {
        console.log('hello')
        return res.render('recipes/random', {response})
    })
    .catch(function (error) {
        console.error(error);
    });
})
*/

// get random recipe

router.get('/random', (req, res, next) => {

    Recipe.estimatedDocumentCount().then((count) => {
        let random = Math.floor(Math.random() * count)

        Recipe.findOne().skip(random)
        .then((randomRecipe) => {
            res.render("recipes/random", {randomRecipe})
        });
    })

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
    
    //req.session.currentUser = author

    const {author, title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date } = req.body;

    Recipe.create({author, title,  description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date })
    .then((recipe) => {
        res.render(`recipes/detail`, { recipe : recipe})
    })
    .catch(error => next(error));

});


// show recipe detail
router.get('/recipe/:recipeId', isLoggedIn, (req, res, next) => { 

    const { recipeId } = req.params;

    Recipe.findById(recipeId)
    .then(recipe => {
        res.render('recipes/detail', { recipe: recipe })
    })
    .catch(error => next(error));
})

//////////////    Edit recipe   /////////////////
router.get('/recipe/:recipeId/edit' , isLoggedIn , (req, res, next) => {
    const { recipeId } = req.params

    Recipe.findById(recipeId).then(recipeToEdit => {
        res.render('recipes/recipe-edit.hbs', {recipe: recipeToEdit})
    })
    .catch(err => next(err))
})


router.post('/recipe/:recipeId/edit', isLoggedIn, (req, res, next) => {
    const { recipeId } =  req.params
    const { author, title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date } = req.body

    Recipe.findByIdAndUpdate(recipeId, { author, title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl, date }, { new : true })
    .then(updatedRecipe => {
        res.redirect(`/recipe/${updatedRecipe.id}`)
    })
    .catch(err => next(err))
})


////////////////////  Delete recipe //////////////////
router.post('/recipe/:recipeId/delete', isLoggedIn, (req, res, next) => {
    const { recipeId } = req.params

    Recipe.findByIdAndDelete(recipeId)
    .then(() => {
        console.log('recipe deleted')
        res.redirect('/recipes')
    })
    .catch(err => next(err))
})

module.exports = router;
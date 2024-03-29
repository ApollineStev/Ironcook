const { Router } = require("express");
const router = new Router();

const axios = require('axios')

const mongoose = require("mongoose");

const fileUploader = require('../config/cloudinary.config')

////// middleware  //////
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");


//////////////   recipe list /////////////////
router.get('/recipes', (req, res, next) => {
    Recipe.find()
    .then(recipes => {
            res.render("recipes/recipe-list", {recipe: recipes ,
                userInSession: req.session.currentUser})
    })
    .catch(err => next(err))
})


// get random recipe

router.get('/random', (req, res, next) => {

    Recipe.estimatedDocumentCount().then((count) => {
        let random = Math.floor(Math.random() * count)

        Recipe.findOne().skip(random)
        .populate('author')
        .then((randomRecipe) => {
            let date = randomRecipe.date.toDateString()
            res.render("recipes/random", {date, randomRecipe,
            userInSession: req.session.currentUser})
        });
    })
})


// search recipes
router.get('/recipes-search', (req, res) => {

    const { wordToSearch } = req.query

    Recipe.find({ $or: [
        {'title': { $regex: wordToSearch }}, 
        {'description': { $regex: wordToSearch }},
        {'cuisine': { $regex: wordToSearch }}
    ]})
    .then(allRecipes => {
        res.render('recipes/search', {recipes: allRecipes, wordToSearch, 
            userInSession: req.session.currentUser})
    }).catch(err => console.log(err))

});


// create a recipe
router.get('/recipe-create', isLoggedIn, (req, res) => {
    res.render('recipes/create', {
        userInSession: req.session.currentUser} ) 
});

router.post('/recipe-create', isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {
    
    const author = req.session.currentUser._id
    
    const {title, description, ingredients, cuisine, dishType, difficulty, cookingTime, date } = req.body;

    Recipe.create({author, title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl: req.file.path, date })
    .then((recipe) => res.render(`recipes/detailsUser`, { recipe : recipe , userInSession: req.session.currentUser}))
    .catch(error => next(error));

});


//////////////    Detail recipe   /////////////////
router.get('/recipe/:recipeId', (req, res, next) => { 

    const { recipeId } = req.params;

    Recipe.findById(recipeId)
    .populate('author')
    .then(recipe => {
        let date = recipe.date.toDateString()
        console.log(date)
        if(req.session.currentUser)
        {
            let user =  req.session.currentUser.username
            let author =  recipe.author.username

            if( user == author )
            {
                res.render('recipes/detailsUser', { date, recipe: recipe,
                userInSession: req.session.currentUser})
            } 
            else
            {
                res.render('recipes/detail', { date, recipe: recipe,
                userInSession: req.session.currentUser})
            }
        }
        else
        {
            res.render('recipes/detail', { date, recipe: recipe })
        }
    })
    .catch(error => next(error));
})

//////////////    Edit recipe   /////////////////
router.get('/recipe/:recipeId/edit', isLoggedIn, (req, res, next) => {
    const { recipeId } = req.params

    Recipe.findById(recipeId).then(recipeToEdit => {
        
        res.render('recipes/recipe-edit.hbs', {recipe: recipeToEdit, 
            userInSession: req.session.currentUser})
    })
    .catch(err => next(err))
})


router.post('/recipe/:recipeId/edit', isLoggedIn, fileUploader.single('imageUrl'),  (req, res, next) => {
    const { recipeId } =  req.params

    const { title, description, ingredients, cuisine, dishType, difficulty, cookingTime, date } = req.body

    Recipe.findByIdAndUpdate(recipeId, { title, description, ingredients, cuisine, dishType, difficulty, cookingTime, imageUrl: req.file.path , date }, { new : true })
        .then(updatedRecipe => {
            res.redirect(`/recipes`)
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
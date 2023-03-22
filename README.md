# Ironcook

## Description

Ironcook is a Full-stack Web Application that users can sign-up and log-in. User can create some recipes, update and delete his/her own recipes. Also can read other user's recipe and can get random recipe.

## User Stories

- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup.
- **sign-up** - As a user I want to sign up on the webpage so that I can create, update and delete my recipes.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account.
- **user profile** - As a user I want to be able to see my recipes so that I can read easily and update or delete recipes.
- **recipes** - As a user I want to see all the recipes so that I can choose which ones I want to read.
- **recipe create** - As a user I want to create a recipe so that I can share my recipes to others.
- **recipe detail** - As a user I want to see the recipe details and descriptions of one recipe so that I can read in detail if I want to cook.


## Backlog

Search bar:
- Users can search keywords and the result shows recipes related with that keywords, escpecially recipe title, description and cuisine.

Random recipe:
- Users can see one random recipe among whole recipes in the database.

About us:
- Users can see who made this web app.


## ROUTES:

- GET / 
  - renders the homepage
- GET /signup
  - redirects to / if user logged in
  - renders the signup form
- POST /signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
- GET /login
  - redirects to / if user logged in
  - renders the login form
- POST /login
  - redirects to / if user logged in
  - body:
    - username
    - password
- GET /userProfile
  - redirects to / if user logged out
  - renders the user profile page(my recipes list)
- POST /logout
  - body: (empty)

- GET /recipes
  - renders the recipe list
- GET /random
  - renders one random recipe

<!-- WIP -->  
- POST /events/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - date
    - location
    - description
- GET /events/:id
  - renders the event detail page
  - includes the list of attendees
  - attend button if user not attending yet
- POST /events/:id/attend 
  - redirects to / if user is anonymous
  - body: (empty - the user is already stored in the session)


## Models

User model
 
```
username: String
email: String
passwordHash: String
```

Recipe model

```
author: ObjectId<User>
title: String
description: String
ingredients: [String]
cuisine: String
dishType: String
difficulty: String
cookingTime: Number
imageUrl: String 
date: Date
``` 


## Links

<!-- ### Trello

[Link to your trello board](https://trello.com) or picture of your physical board
 -->
 
### Git

[Repository Link](https://github.com/ApollineStev/Ironcook)

<!-- Deploy link check! -->
[Deploy Link](https://splendid-gray-nightingale.cyclic.app/)

### Slides

<!-- Slides link update! -->
[Slides Link](http://slides.com)


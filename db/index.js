// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")

const users = [
  { username: "DiogoBarros", 
    email: "diogo.barros@ironhack.com", 
    passwordHash: "$2a$10$LZ8XiLY1melVKdAr.E/WreBSaO.W66uclyIuH3.7CgKqUhdP7FDua"
  },
]
// Password for DiogoBarros -> DiogoBarros1

const recipes = [
  { // user: "", <- later needs populate
    title: "French toast", 
    description:"French toast", 
    ingredients: "pan",
    cuisine: "french",
    dishType: "breakfast",
    image: "https://images.media-allrecipes.com/images/75131.jpg",
    timeToPrepare: 10,
    difficulty: "easy",
    date: "2023-03-10" 
  },
]


// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Ironcook";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);

    User.create(users)
      .then(data => {

        console.log(`${data.length} users inserted.`)
        mongoose.connection.close()

      }).catch((err) => {
        console.error("Error creating products: ", err);
      });

    Recipe.create(recipes)
      .then(data => {

      console.log(`${data.length} recipes inserted.`)
      mongoose.connection.close()

      }).catch((err) => {
      console.error("Error creating products: ", err);
      });

  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

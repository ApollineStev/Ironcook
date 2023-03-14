const { Schema, model } = require("mongoose");

const User = require("../models/User.model");

const recipeSchema = new Schema(
  {
    author: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    ingredients: {
      type: [String],
      required: true
    },
    cuisine: {
      type: String,
      required: true,
    },
    dishType: {
      type: String,
      enum: ["breakfast", "starter", "soup", "tapas", "main", "dessert", "other"]
    },
    difficulty: {
      type: String,
      enum: ["easy", "intermediate", "difficult"]
    },
    cookingTime: {
      type: Number,
      validate: {
        validator: (value) => {
          if (value >= 0)
          {
            return true
          }
          else
          {
            return false
          }
        }
      },
    },
    imageUrl:  {
      type: String,
      default: "https://images.media-allrecipes.com/images/75131.jpg"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Recipe", recipeSchema);
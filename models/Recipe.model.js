const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    /* ingredients: [
      {
        type: String,
        required: true
      }
    ], */
    // image
    // label(time, category, cuisine, difficulty)
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("User", userSchema);
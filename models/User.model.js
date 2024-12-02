const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    isServiceProvider: {
      type: Boolean,
      default: false,
      profilePicture: {
        type: String,
        default: "images/user_1077114.png",
      },
    },
    location: {
      type: String,
    },
    pets: [{
      type: Schema.Types.ObjectId,
      ref: "Pet",
    }],
    services: [{
      type: Schema.Types.ObjectId,
      ref: "Service",
    }],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
    profilePicture: {
      type: String,
      default: "images/user_1077012.png",
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
   
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
      profilePicture: {
        type: String,
        default: "https://www.freepik.com/icon/user_1077114",
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
      default: "https://www.freepik.com/icon/user_1077012",
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

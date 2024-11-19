const { Schema, model } = require("mongoose");

const petSchema = new Schema({
    petName: {
        type: String,
        required: true,
    },
    owner: [{
        type: Schema.Types.ObjectId,
        required: true,
    }],
    species: {
        type: String,
        enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'rodent', 'other'],
        required: true,
    },
    bio: {
        type: String,
    },
    breed: {
        type: String,
    },
    age: {
        type: Number,
        min: 0,
        max: 30,
    },
    weight: {
        type: Number,
        min: 0,
    },
    profilePicture: {
        type: String,
    }
})


module.exports = model("Pet", petSchema);
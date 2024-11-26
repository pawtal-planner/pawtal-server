const { Schema, model } = require("mongoose");

const petSchema = new Schema({
    petName: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
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
        default: "unknown",
        required: true,
    },
    weight: {
        type: Number,
        min: 0,
    },
    profilePicture: {
        type: String,
        default: function () {
            const defaultImages = {
                dog: "images/siberian-husky_375148.png",
                cat: "/images/cat_6363565.png",
                bird: "images/parrot_3157528.png",
                fish: "images/whale_1864475.png",
                reptile: "images/chameleon_1864475.png",
                rodent: "images/hamster_2351140.png",
                other: "images/hen_1864475.png",
            };
            return defaultImages[this.species] || defaultImages.other;
        },
    },
})


module.exports = model("Pet", petSchema);
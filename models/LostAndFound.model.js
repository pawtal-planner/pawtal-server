const { Schema, model } = require("mongoose");

const lostAndFoundSchema = new Schema({
    pet: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["lost", "found", "returned"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model("LostAndFound", lostAndFoundSchema);
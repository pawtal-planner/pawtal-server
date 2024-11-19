const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({ 
    reviewer: [{
        type: Schema.Types.ObjectId,
        required: true,
    }],
    reviewService: [{
        type: Schema.Types.ObjectId,
        required: true,
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model("Review", appointmentSchema);
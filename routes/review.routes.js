const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");

// CREATE a new review
router.post("/reviews", isAuthenticated, async (req, res, next) => {
    const { reviewer, reviewService, rating, comment } = req.body;

    // Validate inputs
    if (!reviewer || !reviewService || rating === undefined) {
        return res.status(400).json({ message: "Reviewer, reviewService, and rating are required." });
    }

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    try {
        // Check if the reviewer exists
        const user = await User.findById(reviewer);
        if (!user) {
            return res.status(404).json({ message: "Reviewer not found." });
        }

        // Check if the service exists
        const service = await Service.findById(reviewService);
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }

        // Create the review
        const newReview = await Review.create({ reviewer, reviewService, rating, comment });
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// GET all reviews
router.get("/reviews", async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate("reviewer", "name email") // Populate reviewer's details
            .populate("reviewService", "description location"); // Populate service details
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

// GET a single review by ID
router.get("/reviews/:reviewId", async (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    try {
        const review = await Review.findById(reviewId)
            .populate("reviewer", "name email")
            .populate("reviewService", "description location");
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
});

// UPDATE a review
router.put("/reviews/:reviewId", isAuthenticated, async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    if (rating !== undefined && (rating < 0 || rating > 5)) {
        return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { rating, comment },
            { new: true, runValidators: true }
        )
            .populate("reviewer", "name email")
            .populate("reviewService", "description location");
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        next(error);
    }
});

// DELETE a review
router.delete("/reviews/:reviewId", isAuthenticated, async (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

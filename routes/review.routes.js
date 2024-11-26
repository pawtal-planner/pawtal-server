const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");

// CREATE a new review
router.post("/reviews", isAuthenticated, (req, res, next) => {
    const { reviewer, reviewService, rating, comment } = req.body;

    // Validate inputs
    if (!reviewer || !reviewService || rating === undefined) {
        return res.status(400).json({ message: "Reviewer, reviewService, and rating are required." });
    }

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    // Create the review
    Review.create({ reviewer, reviewService, rating, comment })
        .then(newReview => {
            // Update the User's reviews array
            const userUpdate = User.findByIdAndUpdate(
                reviewer,
                { $push: { reviews: newReview._id } },
                { new: true }
            );

            // Update the Service's review array
            const serviceUpdate = Service.findByIdAndUpdate(
                reviewService,
                { $push: { review: newReview._id } },
                { new: true }
            );

            // Wait for both updates to complete
            Promise.all([userUpdate, serviceUpdate])
                .then(() => {
                    res.status(201).json(newReview);
                })
                .catch(error => {
                    console.error("Error updating related models:", error);
                    next(error);
                });
        })
        .catch(error => {
            console.error("Error creating review:", error);
            next(error);
        });
});

// GET all reviews
router.get("/reviews", (req, res, next) => {
    Review.find()
        .populate("reviewer", "name email") // Populate reviewer's details
        .populate("reviewService", "description location") // Populate service details
        .then(reviews => {
            res.status(200).json(reviews);
        })
        .catch(error => {
            next(error);
        });
});

// GET a single review by ID
router.get("/reviews/:reviewId", (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    Review.findById(reviewId)
        .populate("reviewer", "name email")
        .populate("reviewService", "description location")
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found." });
            }
            res.status(200).json(review);
        })
        .catch(error => {
            next(error);
        });
});

// UPDATE a review
router.put("/reviews/:reviewId", isAuthenticated, (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    if (rating !== undefined && (rating < 0 || rating > 5)) {
        return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true, runValidators: true }
    )
        .populate("reviewer",  "name email")
        .then(updatedReview => {
            if (!updatedReview) {
                return res.status(404).json({ message: "Review not found." });
            }
            res.status(200).json(updatedReview);
        })
        .catch(error => {
            next(error);
        });
});

// DELETE a review
router.delete("/reviews/:reviewId", isAuthenticated, (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID." });
    }

    Review.findByIdAndDelete(reviewId)
        .then(deletedReview => {
            if (!deletedReview) {
                return res.status(404).json({ message: "Review not found." });
            }
            res.status(200).json({ message: "Review deleted successfully." });
        })
        .catch(error => {
            next(error);
        });
});

module.exports = router;
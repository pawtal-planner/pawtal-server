const router = require('express').Router();
const mongoose = require("mongoose");

const {isAuthenticated} = require('../middleware/jwt');
const Service = require ('../models/Service.moel')
const User = require('../models/User.model');
const Review = require('../models/')


// CREATE a new service
router.post('/services', isAuthenticated, (req, res, next) => {
    const { provider, description, rate, location } = req.body;
    Service.create({ provider, description, rate, location })
        .then((response) => res.status(201).json(response))
        .catch((err) => res.status(500).json(err));
});

// GET all services 

router.get('/services', (req, res, next) => {
    Service.find()
        .populate("provider")
        .populate("review")
        .then((allServices) => res.status(200).json(allServices))
        .catch((err) => res.status(500).json(err));
});


//Get a Single Service by ID
router.get("/services/:serviceId", isAuthenticated, (req, res, next) => {
    const{serviceId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID." });
    }

    Service.findById(serviceId)
        .populate("provider", "name email") // Populate provider details
        .populate({
            path: "reviews", // Assuming reviews reference a Review model
            populate: {
                path: "user", // Populate the user who wrote the review
                select: "name",
            },
        })
        .then((service) => {
            if (!service) {
                return res.status(404).json({ message: "Service not found." });
            }
            res.status(200).json(service);
        })
        .catch((err) => res.status(500).json(err));
});

// DELETE a Service
router.delete("/services/:serviceId", isAuthenticated, (req, res, next) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID." });
    }

    Service.findByIdAndDelete(serviceId)
        .then((deletedService) => {
            if (!deletedService) {
                return res.status(404).json({ message: "Service not found." });
            }
            res.status(200).json({ message: "Service deleted successfully." });
        })
        .catch((err) => res.status(500).json(err));
});

// ADD a Review to a Service
router.post("/services/:serviceId/reviews", isAuthenticated, (req, res, next) => {
    const { serviceId } = req.params;
    const { rating, comment, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID." });
    }

    if (!rating || !comment || !userId) {
        return res.status(400).json({ message: "Missing required fields for review." });
    }

    Review.create({ rating, comment, user: userId, service: serviceId })
        .then((newReview) => {
            return Service.findByIdAndUpdate(
                serviceId,
                { $push: { reviews: newReview._id } },
                { new: true }
            ).populate({
                path: "reviews",
                populate: { path: "user", select: "name" },
            });
        })
        .then((updatedService) => res.status(201).json(updatedService))
        .catch((err) => res.status(500).json(err));
});


// UPDATE Service
router.put("/services/:serviceId", isAuthenticated, (req, res, next) => {
    const { serviceId } = req.params;
    const { description, rate, location } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID." });
    }

    Service.findById(serviceId)
        .then((service) => {
            if (!service) {
                return res.status(404).json({ message: "Service not found." });
            }

            // Check if the authenticated user is the provider
            if (service.provider.toString() !== req.user._id) {
                return res.status(403).json({ message: "You are not authorized to update this service." });
            }

            // Update the service
            return Service.findByIdAndUpdate(
                serviceId,
                { description, rate, location },
                { new: true, runValidators: true }
            );
        })
        .then((updatedService) => {
            if (updatedService) {
                res.status(200).json(updatedService);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to update service", details: err.message });
        });
});



module.exports = router;    
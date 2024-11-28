const router = require('express').Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Service = require ('../models/Service.model')
const User = require('../models/User.model');
const Review = require('../models/Review.model')


// CREATE a new service
router.post('/services', isAuthenticated, (req, res, next) => {
    const { description, rate, location } = req.body;

    const { _id, isServiceProvider } = req.payload;
    console.log("Payload:", req.payload);

    // Check if the user is a service provider
    console.log('isServiceProvider:', isServiceProvider);
    if (!isServiceProvider) {
        return res.status(403).json({ message: "You must be a service provider to create a service." });
    }

    // Create the service
    Service.create({ provider: _id, description, rate, location })
    .then((newService) => {
        console.log("Service created:", newService);
        return User.findByIdAndUpdate(
            _id,
            { $push: { services: newService._id } },
            { new: true }
        ).then((updatedUser) => {
            if (!updatedUser) {
                throw new Error("Failed to update user services");
            }
            console.log("User updated with new service:", updatedUser);
            return newService;
        });
    })
    .then((newService) => res.status(201).json(newService))
    .catch((err) => {
        console.error("Error stack trace:", err); // Full error trace
        res.status(500).json({ message: "Failed to create service", error: err.message });
    });
});


// GET all services 

router.get('/services', (req, res, next) => {
    Service.find()
        .populate("provider")
        .populate("review")
        .then((allServices) => res.status(200).json(allServices))
        .catch((err) => res.status(500).json(err));
});

// GET a single service by ID
router.get('/services/:serviceId', (req, res, next) => { 
    const { serviceId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID." });
    }
    Service.findById(serviceId)
        .populate("provider")
        .populate("review")
        .then((service) => {
            if (!service) {
                return res.status(404).json({ message: "Service not found." });
            }
            res.status(200).json(service);
        })
        .catch((err) => res.status(500).json(err));
});

// Update a single service by ID
router.put("/services/:serviceId", isAuthenticated, async (req, res, next) => {
    const { serviceId } = req.params;
    const { description, rate, location } = req.body; // Destructure the body fields
    const { _id: userId } = req.payload; // Extract the logged-in user's ID

    // Validate the serviceId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
    }

    try {
        // Find the service by ID and check if the logged-in user is the provider
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.provider.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this service." });
        }

        // Update the service fields
        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (rate !== undefined) updateData.rate = rate;
        if (location !== undefined) updateData.location = location;

        const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true, runValidators: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found after update." });
        }

        res.status(200).json(updatedService);
    } catch (err) {
        console.error("Error updating service:", err.message);
        res.status(500).json({ message: "Error updating service", error: err.message });
    }
});


// DELETE a Service
router.delete("/services/:serviceId", isAuthenticated, (req, res, next) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        console.log("Invalid Service ID:", serviceId);
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



module.exports = router;    
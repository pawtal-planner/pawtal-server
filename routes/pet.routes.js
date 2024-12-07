const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

// Post /api/pets - Creates a new pet in the database

router.post("/pets", isAuthenticated, (req, res, next) => {
    const pet = { petName, owner, species, bio, breed, age, weight, profilePicture } = req.body;

    Pet.create({ petName, owner, species, bio, breed, age, weight, profilePicture })
    .then((newPet) => {
        // Add the pet to the user's pets array
        return User.findByIdAndUpdate(
            owner,
            { $push: { pets: newPet._id } },
            { new: true }
        ).then(() => newPet);
    })
    .then((newPet) => {
        res.status(201).json(newPet);
    })
    .catch((err) => {
        console.error("Error while creating new pet:", err);
        res.status(500).json({ message: "Error while creating new pet", error: err.message });
    });
});

// Get /api/pets - Get all pets

router.get("/pets", isAuthenticated,(req, res, next) => {
    Pet.find()
        .populate("owner")
        .then((allPets) => res.json(allPets))
        .catch((err) => res.status(500).json(err));
});


// Get /api/pets/:petId - Get one pet by id

router.get("/pets/:petId", isAuthenticated, (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Pet.findById(petId)
        .populate("owner")
        .then((pet) => res.json(pet))
        .catch((err) => res.status(500).json(err));
});


// Put /api/pets/:petId - Update pet


router.put("/pets/:petId", isAuthenticated, (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: " Specified id is not valid" });
        return;
    }

    Pet.findByIdAndUpdate(petId, req.body, { new: true , runValidators: true })
        .then((updatedPet) => res.json(updatedPet))
        .catch((err) => res.status(500).json(err));
});

// Delete /api/pets/:petId - Delete pet

router.delete("/pets/:petId", isAuthenticated, (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({
            message: "Specified id is not valid"
        });
        return;
    }

    Pet.findByIdAndDelete(petId)
        .then((deletedPet) => {
            if (!deletedPet) {
                return res.status(404).json({ message: "Pet not found" });
            }
            res.json({
                message: `Pet with ${petId} was removed from database`,
            });
        })
        .catch((err) => res.status(500).json({ message: "Error deleting pet", error: err.message }));
});


module.exports = router;

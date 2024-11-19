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
        .then((response) => { res.status(201).json(response) })
        .catch((err) => {
            console.log("Error whule creating new pet", err);
            res.status(500).json({ message: "Error while creating new pet" });
        });
});

// Get /api/pets - Get all pets

router.get("/pets", (req, res, next) => {
    Pet.find()
        .populate("users")
        .then((allPets) => res.json(allPets))
        .catch((err) => res.status(500).json(err));
});


// Get /api/pets/:petId - Get one pet by id

router.get("/pets/:petid", (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Pet.findById(petId)
        .populate("users")
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

    Pet.findByIdAndUpdate(petId, req.bodt, { new: true })
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
        .then(() =>
            res.json({
                message: `Pet with ${petId} was removed from database`
            })
        )
        .catch((err) => res.status(500).json(err));
});


module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const LostAndFound = require("../models/LostAndFound.model");

// CREATE a Lost or Found record
router.post("/lost-and-found", isAuthenticated, (req, res, next) => {
    const { pet, date, location, description, contactInfo, status } = req.body;

    // Validate required fields
    if (!pet || !date || !location || !description || !contactInfo || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    LostAndFound.create({ pet, date, location, description, contactInfo, status })
        .then((response) => res.status(201).json(response))
        .catch((err) => {
            console.error("Error creating lost-and-found record:", err.message);
            res.status(500).json({ message: "Error creating record", error: err.message });
        });
});

// GET All Lost and Found records
router.get("/lost-and-found", (req, res, next) => {
    LostAndFound.find()
        .sort({ createdAt: -1 }) // Sort by the most recent entries
        .then((records) => res.status(200).json(records))
        .catch((err) => {
            console.error("Error fetching records:", err.message);
            res.status(500).json({ message: "Error fetching records", error: err.message });
        });
});

// GET a Single Lost or Found record by ID
router.get("/lost-and-found/:recordId", (req, res, next) => {
    const { recordId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
        return res.status(400).json({ message: "Invalid record ID." });
    }

    LostAndFound.findById(recordId)
        .then((record) => {
            if (!record) {
                return res.status(404).json({ message: "Record not found." });
            }
            res.status(200).json(record);
        })
        .catch((err) => {
            console.error("Error fetching record:", err.message);
            res.status(500).json({ message: "Error fetching record", error: err.message });
        });
});

// UPDATE a Lost or Found record
router.put("/lost-and-found/:recordId", isAuthenticated, (req, res, next) => {
    const { recordId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
        return res.status(400).json({ message: "Invalid record ID." });
    }

    LostAndFound.findByIdAndUpdate(recordId, req.body, { new: true, runValidators: true })
        .then((updatedRecord) => {
            if (!updatedRecord) {
                return res.status(404).json({ message: "Record not found." });
            }
            res.status(200).json(updatedRecord);
        })
        .catch((err) => {
            console.error("Error updating record:", err.message);
            res.status(500).json({ message: "Error updating record", error: err.message });
        });
});

// DELETE a Lost or Found record
router.delete("/lost-and-found/:recordId", isAuthenticated, (req, res, next) => {
    const { recordId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
        return res.status(400).json({ message: "Invalid record ID." });
    }

    LostAndFound.findByIdAndDelete(recordId)
        .then((deletedRecord) => {
            if (!deletedRecord) {
                return res.status(404).json({ message: "Record not found." });
            }
            res.status(200).json({ message: `Record with ID ${recordId} deleted successfully.` });
        })
        .catch((err) => {
            console.error("Error deleting record:", err.message);
            res.status(500).json({ message: "Error deleting record", error: err.message });
        });
});

module.exports = router;
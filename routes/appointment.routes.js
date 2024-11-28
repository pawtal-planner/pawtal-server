const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Appointment = require("../models/Appointment.model");
const Service = require("../models/Service.model");
const Pet = require("../models/Pet.model");

// CREATE an Appointment
router.post("/appointments", isAuthenticated, async (req, res, next) => {
    const { service, pet, date, time, status, notes } = req.body;

    // Validate required fields
    if (!service || !date || !time) {
        return res.status(400).json({ message: "Service, date, and time are required." });
    }

    try {
        const newAppointment = await Appointment.create({
            service,
            pet,
            date,
            time,
            status,
            notes,
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error creating appointment:", error.message);
        res.status(500).json({ message: "Error creating appointment", error: error.message });
    }
});

// GET All Appointments
router.get("/appointments", isAuthenticated, (req, res, next) => {
    Appointment.find()
        
        .then((appointments) => res.status(200).json(appointments))
        .catch((err) => {
            console.error("Error fetching appointments:", err.message);
            res.status(500).json({ message: "Error fetching appointments", error: err.message });
        });
});

// GET Appointment by ID
router.get("/appointments/:appointmentId", isAuthenticated, (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }

    Appointment.findById(appointmentId)
    
        .then((appointment) => {
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            res.status(200).json(appointment);
        })
        .catch((err) => {
            console.error("Error fetching appointment:", err.message);
            res.status(500).json({ message: "Error fetching appointment", error: err.message });
        });
});

// UPDATE Appointment
router.put("/appointments/:appointmentId", isAuthenticated, (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }

    Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true, runValidators: true })
        .then((updatedAppointment) => {
            if (!updatedAppointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            res.status(200).json(updatedAppointment);
        })
        .catch((err) => {
            console.error("Error updating appointment:", err.message);
            res.status(500).json({ message: "Error updating appointment", error: err.message });
        });
});

// DELETE Appointment
router.delete("/appointments/:appointmentId", isAuthenticated, (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }

    Appointment.findByIdAndDelete(appointmentId)
        .then((deletedAppointment) => {
            if (!deletedAppointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            res.status(200).json({ message: `Appointment with ID ${appointmentId} deleted successfully.` });
        })
        .catch((err) => {
            console.error("Error deleting appointment:", err.message);
            res.status(500).json({ message: "Error deleting appointment", error: err.message });
        });
});

module.exports = router;

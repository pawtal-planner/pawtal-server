const mongoose = require("mongoose");
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Service = require("../models/Service.model");
const Review = require("../models/Review.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const router = require("./pet.routes.js");

router.get("/user/:userId", isAuthenticated, (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
        .populate("pets")
        .populate("services")
        .populate("reviews")
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).json(err));
});


// UPDATE profile picture
const { uploader } = require("cloudinary").v2;

router.put("/users/:userId/profile-picture", isAuthenticated, async (req, res, next) => {
    const { userId } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: "Profile image file is required." });
    }

    try {
        // Upload file to Cloudinary
        const uploadResult = await uploader.upload(req.file.path);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        user.profileImg = uploadResult.secure_url; 
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
});

// UPDATE Profile

router.put("/users/:userId/profile", isAuthenticated, async (req, res, next) => {
    const { userId } = req.params;
    const { name } = req.body;
    const { location } = req.body;

    User.findByIdAndUpdate(userId, { name, location }, { new: true })
        .then((updatedUser) => res.json(updatedUser))
        .catch((err) => res.status(500).json(err));
}); 


// DELETE user  

router.delete("/users/:userId", isAuthenticated, (req, res, next) => {
    const { userId } = req.params;
    User.findByIdAndRemove(userId)
        .then(() => res.json({ message: "User deleted successfully" }))
        .catch((err) => res.status(500).json(err));
});

// DELETE /users/:userId/profile-picture:

router.delete("/users/:userId/profile-picture", isAuthenticated, async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        user.profileImg = "default-placeholder-url"; // Revert to default image
        const updatedUser = await user.save();

        res.json({ message: "Profile picture removed.", user: updatedUser });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

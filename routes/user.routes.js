const mongoose = require("mongoose");
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Service = require("../models/Service.model");
const Review = require("../models/Review.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const router = require("./pet.routes.js");

// Route to get another user's data by their ID
router.get("/users/:userId", isAuthenticated, (req, res, next) => {
    const { userId } = req.params;

    User.findById(userId)
        .populate("pets")
        .populate("services")
        .populate("reviews")
        .then((response) => {
            if (!response) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(response);
        })
        .catch((err) => res.status(500).json(err));
});

// UPDATE Profile

router.put("/users/:userId/profile", isAuthenticated, (req, res, next) => {
    const { userId } = req.params;
    const { name, location } = req.body; // Destructure data from body

    User.findByIdAndUpdate(
        userId,
        { name, location },
        { new: true, runValidators: true } // Return the updated document
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error updating profile", error: err.message });
        });
});


// UPDATE profile picture


router.put("/users/:userId/profile-picture", isAuthenticated, async (req, res, next) => {
    const { userId } = req.params;
    const { profilePicture } = req.body;

       User.findByIdAndUpdate(userId, { profilePicture }, { new: true })
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

        user.profilePicture = user.default ; 
        const updatedUser = await user.save();

        res.json({ message: "Profile picture removed.", user: updatedUser });
    } catch (err) {
        next(err);
    }
});



module.exports = router;

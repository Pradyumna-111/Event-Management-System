import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

// PUT /api/user/profile
router.put("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                phone: updatedUser.phone,
                token: req.headers.authorization.split(" ")[1],
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating profile" });
    }
});

// PUT /api/user/password
router.put("/password", protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(401).json({ message: "Invalid current password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating password" });
    }
});

// DELETE /api/user
router.delete("/", protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // If organizer, delete their events too? (Optional, let's keep it simple for now or handle cascade)
        // For safety, let's just delete tickets and the user
        await Ticket.deleteMany({ user: userId });

        // If they are an organizer, maybe we should also delete their events
        if (req.user.role === "organizer") {
            await Event.deleteMany({ createdBy: userId });
        }

        await User.findByIdAndDelete(userId);

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error deleting account" });
    }
});

export default router;

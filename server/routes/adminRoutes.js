import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getOrganizerAnalytics,
    getAdminAnalytics,
    getAllUsers,
    deleteUser,
    getAllEventsAdmin,
} from "../controllers/adminController.js";
import {
    exportAttendeeData,
    exportAllEventsData,
} from "../controllers/reportController.js";

const router = express.Router();

// Organizer Analytics
router.get("/organizer/analytics", protect, getOrganizerAnalytics);

// Admin Analytics
router.get("/admin/analytics", protect, admin, getAdminAnalytics);

// User Management (Admin only)
router.get("/admin/users", protect, admin, getAllUsers);
router.delete("/admin/users/:id", protect, admin, deleteUser);

// Event Management (Admin only)
router.get("/admin/events", protect, admin, getAllEventsAdmin);

// Reporting
router.get("/reports/attendees/:eventId", protect, exportAttendeeData);
router.get("/reports/all-events", protect, admin, exportAllEventsData);

export default router;

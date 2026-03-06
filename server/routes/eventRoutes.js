import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    createEvent,
    getEvents,
    getCreatedEvents,
    getEventById,
    addRating
} from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events → all events (with search/filter)
router.get("/", getEvents);

// GET /api/events/:id → event details
router.get("/:id", getEventById);

// GET /api/events/created → events by logged-in organizer
router.get("/created", protect, getCreatedEvents);

// POST /api/events → create event (protected)
router.post("/", protect, upload.single("banner"), createEvent);

// POST /api/events/:id/ratings → add rating
router.post("/:id/ratings", protect, addRating);

export default router;

import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createEvent, getEvents, getCreatedEvents } from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events → all events
router.get("/", getEvents);

// GET /api/events/created → events by logged-in organizer
router.get("/created", protect, getCreatedEvents);

// POST /api/events → create event (protected)
router.post("/", protect, upload.single("banner"), createEvent);

export default router;

import express from "express";
import protect  from "../middleware/authMiddleware.js";
import {
    bookTicket,
    getUserTickets,
    getEventTickets,
} from "../controllers/ticketController.js";

const router = express.Router();

// POST → Book a ticket
router.post("/", protect, bookTicket);

// GET → Tickets of a user
router.get("/user/:userId", protect, getUserTickets);

// GET → Tickets of an event (organizer only, can add role check later)
router.get("/event/:eventId", protect, getEventTickets);

export default router;

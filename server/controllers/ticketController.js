import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

// ✅ Book a ticket
export const bookTicket = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Prevent duplicate ticket booking
        const existing = await Ticket.findOne({ user: userId, event: eventId });
        if (existing) {
            return res.status(400).json({ message: "You already booked a ticket for this event" });
        }

        const ticket = await Ticket.create({
            user: userId,
            event: eventId,
        });

        res.status(201).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error booking ticket" });
    }
};

// ✅ Get tickets for a user
export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.params.userId }).populate("event");
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching tickets" });
    }
};

// ✅ (Optional) Get all tickets for an event (for organizers)
export const getEventTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ event: req.params.eventId }).populate("user", "name email");
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching event tickets" });
    }
};

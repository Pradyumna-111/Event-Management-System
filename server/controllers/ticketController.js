import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";
import { sendRegistrationEmail } from "../utils/emailService.js";

// ✅ Book a ticket
export const bookTicket = async (req, res) => {
    try {
        const { eventId, paymentId } = req.body;
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

        // Generate QR code data (e.g., ticket ID)
        // We'll update the QR code field after creation
        const ticket = await Ticket.create({
            user: userId,
            event: eventId,
            paymentId,
        });

        const qrCodeData = await QRCode.toDataURL(ticket._id.toString());
        ticket.qrCode = qrCodeData;
        await ticket.save();

        // Send registration email
        await sendRegistrationEmail(req.user.email, event.title);

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

// ✅ Get all tickets for an event (for organizers)
export const getEventTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ event: req.params.eventId }).populate("user", "name email");
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching event tickets" });
    }
};

// ✅ Check-in attendee
export const checkInAttendee = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId).populate("event");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check if user is organizer of the event
        if (ticket.event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to check-in attendees for this event" });
        }

        if (ticket.checkedIn) {
            return res.status(400).json({ message: "Attendee already checked-in" });
        }

        ticket.checkedIn = true;
        await ticket.save();

        res.json({ message: "Check-in successful", ticket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during check-in" });
    }
};

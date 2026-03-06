import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import { Parser } from "json2csv";

// @desc Export attendee data for an event to CSV
export const exportAttendeeData = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if user is organizer of the event
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to export data for this event" });
        }

        const tickets = await Ticket.find({ event: eventId }).populate("user", "name email");

        const data = tickets.map(ticket => ({
            "Event Title": event.title,
            "Attendee Name": ticket.user.name,
            "Attendee Email": ticket.user.email,
            "Ticket ID": ticket._id,
            "Booked At": ticket.bookedAt,
            "Checked In": ticket.checkedIn ? "Yes" : "No",
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=attendees_${eventId}.csv`);
        res.status(200).send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error exporting attendee data" });
    }
};

// @desc Export all events data to CSV (Admin only)
export const exportAllEventsData = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");

        const data = events.map(event => ({
            "Title": event.title,
            "Organizer": event.createdBy.name,
            "Category": event.category,
            "Date": event.date,
            "Location": event.location,
            "Price": event.price,
            "Capacity": event.capacity,
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=all_events.csv");
        res.status(200).send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error exporting events data" });
    }
};

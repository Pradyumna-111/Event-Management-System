import Event from "../models/Event.js";

// @desc Create a new event (organizers only)
export const createEvent = async (req, res) => {
    const { title, description, date, location } = req.body;

    if (req.user.role !== "organizer") {
        return res.status(403).json({ message: "Only organizers can create events" });
    }

    console.log("Request body:", req.body);
    console.log("File info:", req.file);

    try {
        const event = await Event.create({
            title,
            description,
            date: date ? new Date(date) : undefined,
            location,
            banner: req.file ? (req.file.path || req.file.secure_url) : "",
            createdBy: req.user._id,
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: error.message || "Failed to create event" });
    }
};

// @desc Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: error.message || "Failed to create event" });
    }
};
export const getCreatedEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching created events" });
    }
};

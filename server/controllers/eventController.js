import Event from "../models/Event.js";

// @desc Create a new event (organizers only)
export const createEvent = async (req, res) => {
    const {
        title,
        description,
        category,
        date,
        time,
        location,
        capacity,
        price,
        sessions
    } = req.body;

    if (req.user.role !== "organizer" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only organizers or admins can create events" });
    }

    try {
        const parsedSessions = sessions ? (typeof sessions === 'string' ? JSON.parse(sessions) : sessions) : [];

        const eventData = {
            title,
            description,
            category: category || "General",
            date: date ? new Date(date) : undefined,
            time,
            location,
            capacity: capacity ? Number(capacity) : 100,
            price: price ? Number(price) : 0,
            banner: req.file ? (req.file.path || req.file.secure_url) : "",
            createdBy: req.user._id,
            sessions: parsedSessions,
        };

        const event = await Event.create(eventData);
        res.status(201).json(event);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: error.message || "Failed to create event" });
    }
};

// @desc Get all events with search and filter
export const getEvents = async (req, res) => {
    const { search, category, date } = req.query;
    let query = {};

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
        query.category = category;
    }
    if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        query.date = { $gte: start, $lt: end };
    }

    try {
        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({ message: error.message || "Failed to fetch events" });
    }
};

// @desc Get events created by organizer
export const getCreatedEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching created events" });
    }
};

// @desc Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "name email");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event details" });
    }
};

// @desc Add rating/feedback to event
export const addRating = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const alreadyRated = event.ratings.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyRated) {
            return res.status(400).json({ message: "Event already rated" });
        }

        const newRating = {
            user: req.user._id,
            rating: Number(rating),
            comment,
        };

        event.ratings.push(newRating);
        await event.save();
        res.status(201).json({ message: "Rating added" });
    } catch (error) {
        res.status(500).json({ message: "Error adding rating" });
    }
};

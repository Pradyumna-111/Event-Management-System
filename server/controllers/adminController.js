import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";

// @desc Get analytics for organizer (created events only)
export const getOrganizerAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all events created by this organizer
        const events = await Event.find({ createdBy: userId });
        const eventIds = events.map(e => e._id);

        // Get all registrations for these events
        const registrations = await Ticket.find({ event: { $in: eventIds } });

        // Calculate total revenue
        let totalRevenue = 0;
        events.forEach(event => {
            const count = registrations.filter(r => r.event.toString() === event._id.toString()).length;
            totalRevenue += count * (event.price || 0);
        });

        // Registration data over time (simplified)
        const analyticsData = {
            totalEvents: events.length,
            totalRegistrations: registrations.length,
            totalRevenue: totalRevenue,
            eventsSummary: events.map(event => ({
                id: event._id,
                title: event.title,
                count: registrations.filter(r => r.event.toString() === event._id.toString()).length,
                revenue: registrations.filter(r => r.event.toString() === event._id.toString()).length * (event.price || 0)
            }))
        };

        res.json(analyticsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching organizer analytics" });
    }
};

// @desc Get analytics for admin (all platform data)
export const getAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const allRegistrations = await Ticket.find().populate("event");

        const totalRevenue = allRegistrations.reduce((acc, reg) => {
            return acc + (reg.event.price || 0);
        }, 0);

        res.json({
            totalUsers,
            totalEvents,
            totalRegistrations: allRegistrations.length,
            totalRevenue,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching admin analytics" });
    }
};

// @desc Manage users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === "admin") {
                return res.status(400).json({ message: "Cannot delete admin user" });
            }
            await user.deleteOne();
            res.json({ message: "User removed" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// @desc Manage events (Admin only)
export const getAllEventsAdmin = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
};

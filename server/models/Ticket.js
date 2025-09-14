// models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: String,
    bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Ticket", ticketSchema);

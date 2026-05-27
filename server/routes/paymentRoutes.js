import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import protect from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", protect, async (req, res) => {
    try {
        const { eventId } = req.body;

        // Fetch event from database to get official price
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const options = {
            amount: event.price * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                eventId: eventId,
                userId: req.user._id.toString()
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay order error:", error);
        res.status(500).json({ message: "Razorpay order creation failed" });
    }
});

// Verify Razorpay Payment and Create Ticket
router.post("/verify-payment", protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Retrieve order details from Razorpay to get the correct eventId from notes
            const order = await razorpay.orders.fetch(razorpay_order_id);
            const eventId = order.notes.eventId;

            if (!eventId) {
                return res.status(400).json({ message: "Order metadata missing event information" });
            }

            // Check if ticket already exists
            const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
            if (!existingTicket) {
                await Ticket.create({
                    user: userId,
                    event: eventId,
                    bookedAt: new Date()
                });
            }
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
});

export default router;

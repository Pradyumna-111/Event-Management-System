import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import protect from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

// Create Stripe Checkout Session
router.post("/create-checkout-session", protect, async (req, res) => {
    try {
        const { eventId } = req.body;
        const customerEmail = req.user.email;

        // Fetch event from database to get official price and title
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: event.title,
                        },
                        unit_amount: event.price * 100, // Stripe expects amount in paise (for INR)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/my-tickets?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/events/${eventId}`,
            customer_email: customerEmail,
            metadata: {
                eventId: eventId,
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ message: "Stripe checkout session creation failed" });
    }
});

// Verify Stripe Session and Create Ticket
router.post("/verify-session", protect, async (req, res) => {
    try {
        const { sessionId, userId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const eventId = session.metadata.eventId;

            // Check if ticket already exists
            const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
            if (!existingTicket) {
                await Ticket.create({
                    user: userId,
                    event: eventId,
                    bookedAt: new Date()
                });
            }
            res.json({ success: true });
        } else {
            res.status(400).json({ message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
});

export default router;

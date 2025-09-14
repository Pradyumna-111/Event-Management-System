import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SuggestedEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/events/all")
            .then(res => setEvents(res.data));
    }, []);

    const handleGetTicket = async (event) => {
        // Call backend to create Razorpay order
        const { data } = await axios.post("http://localhost:5000/api/tickets/order", { amount: event.price });

        const options = {
            key: "YOUR_RAZORPAY_KEY",
            amount: data.amount,
            currency: data.currency,
            order_id: data.id,
            name: event.title,
            description: "Event Ticket Purchase",
            handler: async function (response) {
                // After success, save ticket
                await axios.post("http://localhost:5000/api/tickets/book", {
                    eventId: event._id,
                    paymentId: response.razorpay_payment_id,
                    userId: "CURRENT_USER_ID"
                });
                alert("🎉 Ticket booked successfully!");
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Suggested Events</h1>
            {events.map(event => (
                <div key={event._id} className="border p-4 mb-2">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>₹{event.price}</p>
                    <button
                        onClick={() => handleGetTicket(event)}
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Get Ticket
                    </button>
                </div>
            ))}
        </div>
    );
}

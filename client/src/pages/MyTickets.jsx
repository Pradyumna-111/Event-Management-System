import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/tickets/my/CURRENT_USER_ID")
            .then(res => setTickets(res.data));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">My Tickets</h1>
            {tickets.map(ticket => (
                <div key={ticket._id} className="border p-4 mb-2">
                    <p>🎫 {ticket.event.title}</p>
                    <p>Booked on: {new Date(ticket.bookedAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

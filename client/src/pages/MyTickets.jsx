import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyTickets({ userInfo }) {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const userId = userInfo?._id || userInfo?.user?._id;
        if (userId) {
            axios.get(`http://localhost:5000/api/tickets/my/${userId}`)
                .then(res => setTickets(res.data))
                .catch(err => console.error("Error fetching tickets", err));
        }
    }, [userInfo]);

    return (
        <div className="min-h-screen bg-[#F5F5F5] px-6 py-12 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">My Tickets</h1>
            {tickets.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500 mb-4">You haven't booked any tickets yet.</p>
                    <a href="/" className="text-red-500 font-medium hover:underline">Explore Events</a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{ticket.event?.title || "Event"}</h2>
                                <p className="text-sm text-gray-500">Booked on: {new Date(ticket.bookedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Confirmed</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

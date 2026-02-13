import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

export default function SuggestedEvents({ userInfo }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch recommended/all events
                const res = await axios.get("http://localhost:5000/api/events");
                setEvents(res.data);
            } catch (err) {
                console.error(err);
                setEvents([]);
            }
        };
        fetchEvents();
    }, []);

    const handleBookTicket = async (eventId) => {
        try {
            if (!userInfo) {
                alert("⚠ Please login to book tickets.");
                return;
            }

            const token = userInfo.token;
            await axios.post(
                "http://localhost:5000/api/tickets",
                { eventId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎟 Ticket booked successfully! Check 'My Tickets' section.");
        } catch (err) {
            console.error("Error booking ticket", err);
            alert("❌ Error booking ticket. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Events For You</h1>
                        <p className="text-gray-500 mt-1">Handpicked events based on your interests.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border rounded-full text-sm font-medium hover:border-red-400 hover:text-red-500 transition">Music</button>
                        <button className="px-4 py-2 bg-white border rounded-full text-sm font-medium hover:border-red-400 hover:text-red-500 transition">Comedy</button>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                        <p className="text-gray-400 text-lg italic">No suggested events found at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {events.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                userInfo={userInfo}
                                onBook={handleBookTicket}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

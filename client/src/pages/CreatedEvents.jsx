import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

function CreatedEvents({ userInfo }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchCreatedEvents = async () => {
            if (!userInfo) return;

            try {
                const token = userInfo.token;
                const res = await axios.get("http://localhost:5000/api/events/created", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching created events", err);
                setEvents([]); // fallback to empty
            }
        };

        fetchCreatedEvents();
    }, [userInfo]);

    return (
        <div className="min-h-screen bg-[#F5F5F5] px-6 py-12 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
                Your Created Events
            </h2>

            {events.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500 mb-4">You haven’t created any events yet.</p>
                    <a href="/create-event" className="text-red-500 font-medium hover:underline">Create Your First Event</a>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userInfo={userInfo}
                            // No booking button for organizer
                            onBook={null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CreatedEvents;

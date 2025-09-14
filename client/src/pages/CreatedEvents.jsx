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
        <div className="min-h-screen bg-gray-50 px-6 py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Your Created Events
            </h2>

            {events.length === 0 ? (
                <p className="text-center text-gray-500">
                    You haven’t created any events yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userInfo={userInfo}
                            // 👇 No booking button for organizer
                            onBook={null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CreatedEvents;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) return;

        const token = JSON.parse(storedUser).token;

        const fetchEvent = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvent();
    }, [id]);

    if (!event) return <div className="p-6">Loading event...</div>;

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
                {event.banner && (
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                )}
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-gray-500 mb-2">📅 {new Date(event.date).toDateString()}</p>
                <p className="text-gray-500 mb-2">📍 {event.location}</p>
                <p className="text-gray-500">👤 Organized by: {event.createdBy?.name || "Unknown"}</p>
            </div>
        </div>
    );
}

export default EventDetails;

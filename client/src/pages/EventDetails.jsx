import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EventDetails({ userInfo }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Publicly accessible if needed, but let's use token if available
                const config = userInfo ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
                const res = await axios.get(`http://localhost:5000/api/events/${id}`, config);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvent();
    }, [id, userInfo]);

    const handleBook = async () => {
        if (!userInfo) {
            alert("⚠ Please login to book tickets.");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/tickets",
                { eventId: id },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            alert("🎟 Ticket booked successfully!");
        } catch (err) {
            console.error("Error booking ticket", err);
            alert(err.response?.data?.message || "❌ Error booking ticket");
        }
    };

    if (!event) return <div className="p-6 text-center">Loading event details...</div>;

    const eventDate = new Date(event.date);

    return (
        <div className="min-h-screen bg-[#F5F5F5] pb-12">
            {/* Banner Section */}
            <div className="w-full h-[400px] bg-black relative">
                {event.banner ? (
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Banner Image
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">📅 {eventDate.toDateString()}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">📍 {event.location}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">🏷️ ₹{event.price || 499}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-gray-700">About the Event</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>

                        <div className="border-t pt-6">
                            <p className="text-sm text-gray-500">Organized by</p>
                            <p className="font-bold text-gray-700">{event.createdBy?.name || "Event Organizer"}</p>
                        </div>
                    </div>

                    <div className="md:w-80">
                        <div className="bg-gray-50 p-6 rounded-xl border sticky top-24">
                            <p className="text-gray-500 mb-1">Price</p>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">₹{event.price || 499}</h2>

                            <button
                                onClick={handleBook}
                                className="w-full bg-red-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-md mb-4"
                            >
                                Book Now
                            </button>
                            <p className="text-center text-xs text-gray-400">Secure Payment Powered by Cashfree</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;

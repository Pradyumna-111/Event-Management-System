import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import ChatbotWidget from "../components/ChatbotWidget";
import axios from "axios";

function Home({ userInfo }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/events");
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events", err);
                // fallback demo events
                setEvents([
                    {
                        _id: 1,
                        title: "Music Concert",
                        date: "2025-09-20",
                        description: "Amazing live music",
                        banner: "",
                    },
                    {
                        _id: 2,
                        title: "Art Exhibition",
                        date: "2025-09-25",
                        description: "Modern art display",
                        banner: "",
                    },
                ]);
            }
        };
        fetchEvents();
    }, []);

    // ✅ Ticket Booking
    const handleBookTicket = async (eventId) => {
        try {
            if (!userInfo) {
                alert("⚠ Please login to book tickets.");
                return;
            }

            if (userInfo.user.role !== "attendee") {
                alert("⚠ Only attendees can book tickets!");
                return;
            }

            const token = userInfo.token;
            await axios.post(
                "http://localhost:5000/api/tickets",
                { eventId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎟 Ticket booked successfully!");
        } catch (err) {
            console.error("Error booking ticket", err);
            alert("❌ Error booking ticket");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[70vh] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1503424886304-84a25f5a7d70?auto=format&fit=crop&w=1470&q=80')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 opacity-70"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                        AI-Powered Event Management
                    </h1>
                    <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
                        Discover, Create, and Manage Events Smarter with Gemini AI
                    </p>
                </div>
            </section>

            {/* Events Section */}
            <section className="px-6 py-16 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                    Upcoming Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userInfo={userInfo}
                            onBook={handleBookTicket}
                        />
                    ))}
                </div>
            </section>

            {/* Chatbot Widget */}
            <ChatbotWidget />
        </div>
    );
}

export default Home;

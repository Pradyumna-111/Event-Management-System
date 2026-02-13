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

    const categories = ["All", "Music", "Comedy", "Workshops", "Sports", "Performances", "Conferences"];

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Featured Carousel (Simplified) */}
            <section className="w-full bg-[#EBEBEB] py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-48 md:h-80 w-full rounded-xl overflow-hidden relative shadow-md">
                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1470&q=80"
                            className="w-full h-full object-cover"
                            alt="Featured Event"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                            <div>
                                <h2 className="text-white text-3xl md:text-5xl font-bold mb-2">Grand Music Festival 2025</h2>
                                <p className="text-white/90 text-lg">Experience the magic of live music under the stars.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Filter */}
            <section className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto no-scrollbar flex gap-8 whitespace-nowrap text-sm font-medium text-gray-600">
                    {categories.map(cat => (
                        <button key={cat} className="hover:text-red-500 transition cursor-pointer">{cat}</button>
                    ))}
                </div>
            </section>

            {/* Events Section */}
            <section className="px-6 py-12 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Recommended Events
                    </h2>
                    <button className="text-red-500 text-sm font-medium hover:underline">See All ❯</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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

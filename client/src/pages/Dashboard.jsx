import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]); // organizer's events
    const [tickets, setTickets] = useState([]); // attendee's tickets
    const [suggestedEvents, setSuggestedEvents] = useState([]); // separate suggested events
    const navigate = useNavigate();

    // ✅ Load profile + relevant data
    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        const token = JSON.parse(storedUser).token;

        const fetchProfileAndData = async () => {
            try {
                // ✅ Profile
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);

                if (res.data.role === "organizer") {
                    // ✅ Organizer → fetch events they created
                    const eventRes = await axios.get("http://localhost:5000/api/events", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEvents(eventRes.data.filter((e) => e.createdBy === res.data._id));
                }

                if (res.data.role === "attendee") {
                    // ✅ Attendee → fetch tickets
                    const ticketRes = await axios.get(
                        `http://localhost:5000/api/tickets/user/${res.data._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setTickets(ticketRes.data);

                    // ✅ Suggested events → for now fetch all events (later AI recs)
                    const eventRes = await axios.get("http://localhost:5000/api/events", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setSuggestedEvents(eventRes.data);
                }
            } catch (err) {
                console.error(err);
                localStorage.removeItem("userInfo");
                navigate("/login");
            }
        };

        fetchProfileAndData();
    }, [navigate]);

    // ✅ Ticket booking handler
    const handleGetTicket = async (eventId) => {
        try {
            const storedUser = localStorage.getItem("userInfo");
            const token = JSON.parse(storedUser).token;

            await axios.post(
                "http://localhost:5000/api/tickets",
                { eventId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎟 Ticket booked successfully!");

            // Refresh tickets without full reload
            const updatedTickets = await axios.get(
                `http://localhost:5000/api/tickets/user/${user._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTickets(updatedTickets.data);
        } catch (err) {
            console.error(err);
            alert("❌ Error booking ticket");
        }
    };

    if (!user) {
        return <div className="text-center mt-10 text-lg">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 🎉</h1>

            {/* Profile */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>

            {/* Organizer View */}
            {user.role === "organizer" && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Created Events</h2>
                        <button
                            onClick={() => navigate("/create-event")}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                        >
                            + Create Event
                        </button>
                    </div>
                    {events.length > 0 ? (
                        <ul className="space-y-4">
                            {events.map((event) => (
                                <li
                                    key={event._id}
                                    onClick={() => navigate(`/events/${event._id}`)}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-lg transition cursor-pointer"
                                >
                                    {event.banner && (
                                        <img
                                            src={event.banner}
                                            alt={event.title}
                                            className="w-28 h-28 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg">{event.title}</h3>
                                        <p className="text-gray-600 text-sm">{event.description}</p>
                                        <p className="text-gray-500 text-sm">
                                            📅 {new Date(event.date).toDateString()} | 📍 {event.location}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You haven’t created any events yet.</p>
                    )}
                </div>
            )}

            {/* Attendee View */}
            {user.role === "attendee" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Tickets */}
                    <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
                    {tickets.length > 0 ? (
                        <ul className="space-y-4">
                            {tickets.map((ticket) => (
                                <li
                                    key={ticket._id}
                                    onClick={() => navigate(`/events/${ticket.event._id}`)}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-lg transition cursor-pointer"
                                >
                                    {ticket.event.banner && (
                                        <img
                                            src={ticket.event.banner}
                                            alt={ticket.event.title}
                                            className="w-28 h-28 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{ticket.event.title}</h3>
                                        <p className="text-gray-600 text-sm">🎟 Ticket ID: {ticket._id}</p>
                                        <p className="text-gray-500 text-sm">
                                            📅 {new Date(ticket.event.date).toDateString()} | 📍 {ticket.event.location}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No tickets booked yet.</p>
                    )}

                    {/* Suggested Events */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">🎉 Suggested Events</h2>
                        {suggestedEvents.length > 0 ? (
                            <ul className="space-y-4">
                                {suggestedEvents.map((event) => (
                                    <li
                                        key={event._id}
                                        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
                                    >
                                        {event.banner && (
                                            <img
                                                src={event.banner}
                                                alt={event.title}
                                                className="w-28 h-28 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{event.title}</h3>
                                            <p className="text-gray-600 text-sm">{event.description}</p>
                                            <p className="text-gray-500 text-sm">
                                                📅 {new Date(event.date).toDateString()} | 📍 {event.location}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleGetTicket(event._id)}
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            🎟 Get Ticket
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No suggested events right now.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

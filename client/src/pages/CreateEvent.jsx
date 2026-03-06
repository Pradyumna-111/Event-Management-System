import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

function CreateEvent({ userInfo }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(100);
    const [price, setPrice] = useState(0);
    const [banner, setBanner] = useState(null);
    const [sessions, setSessions] = useState([{ title: "", speaker: "", time: "" }]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const categories = ["Music", "Tech", "Business", "Sports", "Arts", "Health", "Education", "Other"];

    const handleSessionChange = (index, field, value) => {
        const updatedSessions = [...sessions];
        updatedSessions[index][field] = value;
        setSessions(updatedSessions);
    };

    const addSession = () => {
        setSessions([...sessions, { title: "", speaker: "", time: "" }]);
    };

    const removeSession = (index) => {
        setSessions(sessions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            navigate("/login");
            return;
        }

        const token = userInfo.token;

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("date", date);
            formData.append("time", time);
            formData.append("location", location);
            formData.append("capacity", capacity);
            formData.append("price", price);
            formData.append("sessions", JSON.stringify(sessions));
            if (banner) formData.append("banner", banner);

            await axios.post("http://localhost:5000/api/events", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("✅ Event created successfully!");
            setTimeout(() => navigate("/created-events"), 2000);
        } catch (err) {
            setMessage(err.response?.data.message || "❌ Failed to create event");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Event</h2>
                {message && (
                    <div className={`mb-4 p-3 rounded text-sm ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            placeholder="e.g. Rock Concert"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500 h-24"
                        placeholder="Tell people what your event is about..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                            type="time"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            placeholder="e.g. Mumbai"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                            type="number"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            className="w-full border px-3 py-2 rounded-lg outline-none focus:border-red-500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Banner</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        onChange={(e) => setBanner(e.target.files[0])}
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Event Sessions</label>
                        <button
                            type="button"
                            onClick={addSession}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-semibold"
                        >
                            <Plus size={16} /> Add Session
                        </button>
                    </div>
                    {sessions.map((session, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-3 border rounded-lg relative bg-gray-50">
                            <input
                                type="text"
                                placeholder="Session Title"
                                className="w-full border px-2 py-1 rounded outline-none text-sm"
                                value={session.title}
                                onChange={(e) => handleSessionChange(index, "title", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Speaker Name"
                                className="w-full border px-2 py-1 rounded outline-none text-sm"
                                value={session.speaker}
                                onChange={(e) => handleSessionChange(index, "speaker", e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    className="w-full border px-2 py-1 rounded outline-none text-sm"
                                    value={session.time}
                                    onChange={(e) => handleSessionChange(index, "time", e.target.value)}
                                    required
                                />
                                {sessions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSession(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition shadow-md"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default CreateEvent;

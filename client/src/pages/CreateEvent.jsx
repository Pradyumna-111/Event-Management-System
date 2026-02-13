import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEvent({ userInfo }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [banner, setBanner] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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
            formData.append("date", date);
            formData.append("location", location);
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
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Event</h2>
                {message && (
                    <div className={`mb-4 p-3 rounded text-sm ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="mb-4">
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

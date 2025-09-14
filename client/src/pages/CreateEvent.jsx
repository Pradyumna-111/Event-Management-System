import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [banner, setBanner] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        const token = JSON.parse(storedUser).token;

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

            setMessage("Event created successfully!");
            navigate("/dashboard");
        } catch (err) {
            setMessage(err.response?.data.message || "Failed to create event");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>
                {message && <p className="text-red-500 mb-4">{message}</p>}

                <div className="mb-4">
                    <label className="block mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded-lg"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Date</label>
                    <input
                        type="date"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1">Upload Banner</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => setBanner(e.target.files[0])}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default CreateEvent;

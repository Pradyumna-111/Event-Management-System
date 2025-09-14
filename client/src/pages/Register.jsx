import { useState } from "react";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("attendee"); // default role
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
                role,
            });
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setMessage("Registration successful!");
            window.location.href = "/dashboard"; // redirect to dashboard
        } catch (err) {
            setMessage(err.response?.data.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {message && <p className="text-red-500 mb-4">{message}</p>}
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1">Role</label>
                    <select
                        className="w-full border px-3 py-2 rounded-lg"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;

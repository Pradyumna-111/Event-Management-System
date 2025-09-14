import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            // save user info in localStorage
            localStorage.setItem("userInfo", JSON.stringify(res.data));

            setMessage("✅ Login successful!");

            // redirect to dashboard using react-router
            navigate("/");
        } catch (err) {
            setMessage(err.response?.data.message || "❌ Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {message && <p className="text-red-500 mb-4 text-center">{message}</p>}

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-indigo-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-indigo-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;

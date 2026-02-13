import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile({ userInfo }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const token = userInfo.token;

        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
                // If token expired, we might want to logout, but let's just show error for now
                // navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate, userInfo]);

    if (!user) {
        return <div className="text-center mt-10 text-lg">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] px-6 py-12 flex items-center justify-center">
            <div className="bg-white max-w-xl w-full rounded-xl shadow-md p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-4">
                        👤
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-600">Account Type:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase text-white ${
                                user.role === "organizer" ? "bg-red-500" : "bg-green-500"
                            }`}
                        >
                            {user.role}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-600">Joined On:</span>
                        <span className="text-gray-800">{new Date(user.createdAt).toDateString()}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="mt-8 w-full border border-red-500 text-red-500 py-2 rounded-lg font-bold hover:bg-red-50 transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Profile;

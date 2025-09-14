import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        const token = JSON.parse(storedUser).token;

        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
                localStorage.removeItem("userInfo");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!user) {
        return <div className="text-center mt-10 text-lg">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="bg-white max-w-xl mx-auto rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">👤 My Profile</h1>
                <div className="space-y-4">
                    <p>
                        <span className="font-semibold">Name:</span> {user.name}
                    </p>
                    <p>
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p>
                        <span className="font-semibold">Role:</span>{" "}
                        <span
                            className={`px-2 py-1 rounded-lg text-white ${
                                user.role === "organizer" ? "bg-indigo-600" : "bg-green-600"
                            }`}
                        >
              {user.role}
            </span>
                    </p>
                    <p>
                        <span className="font-semibold">Joined:</span>{" "}
                        {new Date(user.createdAt).toDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;

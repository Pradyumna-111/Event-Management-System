import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ userInfo, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    // Extract role safely
    const role = userInfo?.user?.role || userInfo?.role;

    // Function to highlight active link
    const getLinkClass = (path) =>
        `hover:underline ${location.pathname === path ? "font-bold underline" : ""}`;

    return (
        <nav className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
            {/* Brand */}
            <Link to="/" className="text-2xl font-bold">Evently</Link>

            {/* Menu Items */}
            <div className="flex gap-6 items-center">
                {!userInfo ? (
                    <>
                        <Link to="/login" className={getLinkClass("/login")}>Login</Link>
                        <Link to="/register" className={getLinkClass("/register")}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" className={getLinkClass("/profile")}>Profile</Link>

                        {/* Attendee Links */}
                        {role === "attendee" && (
                            <>
                                <Link to="/suggested-events" className={getLinkClass("/suggested-events")}>
                                    Suggested Events
                                </Link>
                                <Link to="/my-tickets" className={getLinkClass("/my-tickets")}>
                                    My Tickets
                                </Link>
                            </>
                        )}

                        {/* Organizer Links */}
                        {role === "organizer" && (
                            <>
                                <Link to="/create-event" className={getLinkClass("/create-event")}>
                                    Create Event
                                </Link>
                                <Link to="/created-events" className={getLinkClass("/created-events")}>
                                    Created Events
                                </Link>
                            </>
                        )}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

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
        <nav className="bg-[#333545] text-white px-6 py-3 flex flex-col md:flex-row justify-between items-center shadow-md gap-4">
            {/* Left side: Brand and Search */}
            <div className="flex items-center gap-8 w-full md:w-auto">
                <Link to="/" className="text-2xl font-bold tracking-wider text-red-500">EVENTLY</Link>

                <div className="relative flex-1 md:w-96">
                    <input
                        type="text"
                        placeholder="Search for Events, Plays, Sports and Activities"
                        className="w-full bg-white text-gray-800 px-10 py-2 rounded-md text-sm outline-none"
                    />
                    <span className="absolute left-3 top-2 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Right side: Location, Menu, Auth */}
            <div className="flex gap-6 items-center w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
                    <span className="text-sm font-medium">Select Location</span>
                    <span className="text-xs">▼</span>
                </div>

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
                                    Suggested
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
                                    Created
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

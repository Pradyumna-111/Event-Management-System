import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SuggestedEvents from "./pages/SuggestedEvents";
import MyTickets from "./pages/MyTickets";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";   // ✅ for Cashfree
import CreatedEvents from "./pages/CreatedEvents"; // ✅ organizer's events

function App() {
    const [userInfo, setUserInfo] = useState(null);

    // Load stored user on app mount
    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
    };

    // ✅ Protected Route wrapper
    const ProtectedRoute = ({ children, role }) => {
        if (!userInfo) return <Navigate to="/login" />;
        if (role && userInfo.role !== role) return <Navigate to="/" />;
        return children;
    };

    return (
        <Router>
            {/* ✅ Navbar rendered once globally with user state */}
            <Navbar userInfo={userInfo} onLogout={handleLogout} />

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home userInfo={userInfo} />} />
                <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
                <Route path="/register" element={<Register setUserInfo={setUserInfo} />} />

                {/* Protected routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/suggested-events"
                    element={
                        <ProtectedRoute role="attendee">
                            <SuggestedEvents userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute role="attendee">
                            <MyTickets userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-event"
                    element={
                        <ProtectedRoute role="organizer">
                            <CreateEvent userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/created-events"
                    element={
                        <ProtectedRoute role="organizer">
                            <CreatedEvents userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />

                {/* Event details + Payment */}
                <Route path="/events/:id" element={<EventDetails userInfo={userInfo} />} />
                <Route path="/pay/:eventId" element={<PaymentPage userInfo={userInfo} />} />
            </Routes>
        </Router>
    );
}

export default App;

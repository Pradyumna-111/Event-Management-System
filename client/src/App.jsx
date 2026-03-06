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
import PaymentPage from "./pages/PaymentPage";
import CreatedEvents from "./pages/CreatedEvents";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AttendeeManagement from "./pages/AttendeeManagement";

function App() {
    const [userInfo, setUserInfo] = useState(() => {
        const stored = localStorage.getItem("userInfo");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const handleStorage = () => {
            const stored = localStorage.getItem("userInfo");
            setUserInfo(stored ? JSON.parse(stored) : null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
    };

    const ProtectedRoute = ({ children, role }) => {
        if (!userInfo) return <Navigate to="/login" />;
        if (role && (Array.isArray(role) ? !role.includes(userInfo.role) : userInfo.role !== role)) return <Navigate to="/" />;
        return children;
    };

    return (
        <Router>
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
                        <ProtectedRoute role="participant">
                            <SuggestedEvents userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute role="participant">
                            <MyTickets userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-event"
                    element={
                        <ProtectedRoute role={["organizer", "admin"]}>
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
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="organizer">
                            <Dashboard userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/participants/:eventId"
                    element={
                        <ProtectedRoute role={["organizer", "admin"]}>
                            <AttendeeManagement userInfo={userInfo} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-panel"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminPanel userInfo={userInfo} />
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

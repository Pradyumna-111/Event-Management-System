import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Users, Calendar, TrendingUp, Trash2,
    Shield, Download, Loader2, Search
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function AdminPanel({ userInfo }) {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("analytics");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || userInfo.role !== "admin") {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const [analyticsRes, usersRes, eventsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/admin/analytics", config),
                    axios.get("http://localhost:5000/api/admin/admin/users", config),
                    axios.get("http://localhost:5000/api/admin/admin/events", config)
                ]);

                setAnalytics(analyticsRes.data);
                setUsers(usersRes.data);
                setEvents(eventsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo, navigate]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data.message || "Failed to delete user");
        }
    };

    const handleExportAllEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/reports/all-events", {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'all_events.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert("❌ Failed to export data");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                            Admin <span className="text-red-500">Panel</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Platform-wide management & control</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleExportAllEvents}
                            variant="outline"
                            className="rounded-xl border-2 font-black italic uppercase tracking-widest text-xs h-12 px-8 hover:bg-black hover:text-white transition-all"
                        >
                            <Download className="mr-2 h-4 w-4" /> Export Events
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: "analytics", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
                        { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
                        { id: "events", label: "Events", icon: <Calendar className="h-4 w-4" /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap px-8 py-3 rounded-2xl text-sm font-black italic uppercase tracking-widest transition-all border-2 ${
                                activeTab === tab.id
                                ? "bg-red-500 text-white border-red-500 shadow-xl shadow-red-100"
                                : "bg-white text-gray-400 border-transparent hover:border-gray-200"
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "analytics" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: "Total Users", value: analytics?.totalUsers, icon: <Users />, color: "bg-blue-50 text-blue-500" },
                                { label: "Total Events", value: analytics?.totalEvents, icon: <Calendar />, color: "bg-red-50 text-red-500" },
                                { label: "Registrations", value: analytics?.totalRegistrations, icon: <TrendingUp />, color: "bg-purple-50 text-purple-500" },
                                { label: "Total Revenue", value: `₹${analytics?.totalRevenue}`, icon: <TrendingUp />, color: "bg-green-50 text-green-500" }
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                    <CardContent className="p-8">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-3xl font-black italic text-gray-900">{stat.value}</h3>
                                            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <CardHeader className="p-8 border-b border-gray-50">
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Platform <span className="text-red-500">Users</span></CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.map(user => (
                                            <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <Badge className={`border-none text-[10px] font-black tracking-widest uppercase ${
                                                        user.role === 'admin' ? 'bg-red-500 text-white' :
                                                        user.role === 'organizer' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                        disabled={user.role === "admin"}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "events" && (
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <CardHeader className="p-8 border-b border-gray-50">
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Platform <span className="text-red-500">Events</span></CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Event Details</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Organizer</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {events.map(event => (
                                            <tr key={event._id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                            <img src={event.banner} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 group-hover:text-red-500 transition-colors">{event.title}</p>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                                {new Date(event.date).toLocaleDateString()} • {event.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-bold text-gray-600">{event.createdBy?.name || "Unknown"}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-black italic">₹{event.price}</p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Button
                                                        onClick={() => navigate(`/events/${event._id}`)}
                                                        variant="ghost"
                                                        className="text-xs font-black italic uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

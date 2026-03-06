import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
    LayoutDashboard, Plus, Calendar, Users,
    TrendingUp, Download, CheckCircle, Clock
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Dashboard({ userInfo }) {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const token = userInfo.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Profile
                const profileRes = await axios.get("http://localhost:5000/api/user/profile", config);
                setUser(profileRes.data);

                if (profileRes.data.role === "organizer") {
                    // Events
                    const eventRes = await axios.get("http://localhost:5000/api/events/created", config);
                    setEvents(eventRes.data);

                    // Analytics
                    const analyticsRes = await axios.get("http://localhost:5000/api/admin/organizer/analytics", config);
                    setAnalytics(analyticsRes.data);
                } else if (profileRes.data.role === "participant") {
                    navigate("/my-tickets");
                } else if (profileRes.data.role === "admin") {
                    navigate("/admin-panel");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo, navigate]);

    const handleExportAttendees = async (eventId) => {
        try {
            const token = userInfo.token;
            const res = await axios.get(`http://localhost:5000/api/admin/reports/participants/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `participants_${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert("❌ Failed to export data");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                            Organizer <span className="text-red-500">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Manage your events and track performance</p>
                    </div>
                    <Button
                        onClick={() => navigate("/create-event")}
                        className="bg-red-500 hover:bg-red-600 rounded-xl font-black italic uppercase tracking-widest px-8 h-12 shadow-lg shadow-red-100"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Create Event
                    </Button>
                </div>

                {/* Stats Grid */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Events</p>
                                        <h3 className="text-4xl font-black italic text-gray-900">{analytics.totalEvents}</h3>
                                    </div>
                                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Registrations</p>
                                        <h3 className="text-4xl font-black italic text-gray-900">{analytics.totalRegistrations}</h3>
                                    </div>
                                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                                        <Users className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Revenue</p>
                                        <h3 className="text-4xl font-black italic text-gray-900">₹{analytics.totalRevenue}</h3>
                                    </div>
                                    <div className="p-4 bg-green-50 text-green-500 rounded-2xl">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-6">
                        <CardHeader className="px-2">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Registration Distribution</CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.eventsSummary || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="title" hide />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-6">
                        <CardHeader className="px-2">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Revenue per Event</CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics?.eventsSummary || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="revenue"
                                        nameKey="title"
                                    >
                                        {(analytics?.eventsSummary || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Events Table */}
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Your Created <span className="text-red-500">Events</span></CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Event Details</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {events.map((event) => (
                                        <tr key={event._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <img src={event.banner} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-red-500 transition-colors">{event.title}</p>
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className="border-gray-200 text-gray-500 text-[10px] font-black tracking-widest uppercase">
                                                    {event.category}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${new Date(event.date) > new Date() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Completed'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleExportAttendees(event._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-4 rounded-lg text-xs font-black italic uppercase tracking-widest text-gray-500 hover:text-red-500"
                                                    >
                                                        <Download className="h-3 w-3 mr-2" /> Export
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate(`/participants/${event._id}`)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-4 rounded-lg text-xs font-black italic uppercase tracking-widest text-gray-500 hover:text-red-500"
                                                    >
                                                        Attendees
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate(`/events/${event._id}`)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-4 rounded-lg text-xs font-black italic uppercase tracking-widest text-gray-500 hover:text-red-500"
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {events.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-gray-400 italic font-bold">You haven’t created any events yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Dashboard;

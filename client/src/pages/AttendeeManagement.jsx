import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Users, CheckCircle2, QrCode, Mail,
    ArrowLeft, Loader2, Search, Download
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

export default function AttendeeManagement({ userInfo }) {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [attendees, setAttendees] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [checkingIn, setCheckingIn] = useState(null);

    useEffect(() => {
        if (!userInfo || (userInfo.role !== "organizer" && userInfo.role !== "admin")) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const [eventRes, attendeesRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/events/${eventId}`, config),
                    axios.get(`http://localhost:5000/api/tickets/event/${eventId}`, config)
                ]);

                setEvent(eventRes.data);
                setAttendees(attendeesRes.data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch attendee data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, userInfo, navigate]);

    const handleCheckIn = async (ticketId) => {
        setCheckingIn(ticketId);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`http://localhost:5000/api/tickets/check-in`, { ticketId }, config);

            setAttendees(prev => prev.map(t =>
                t._id === ticketId ? { ...t, checkedIn: true } : t
            ));
        } catch (err) {
            alert(err.response?.data.message || "Check-in failed");
        } finally {
            setCheckingIn(null);
        }
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob'
            };
            const res = await axios.get(`http://localhost:5000/api/admin/reports/attendees/${eventId}`, config);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendees_${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert("Export failed");
        }
    };

    const filteredAttendees = attendees.filter(t =>
        t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="mb-8 font-bold text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Management</p>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                            Attendee <span className="text-red-500">List</span>
                        </h1>
                        <p className="text-gray-500 font-bold mt-4">{event?.title}</p>
                    </div>
                    <Button
                        onClick={handleExport}
                        className="bg-black text-white hover:bg-gray-800 rounded-xl font-black italic uppercase tracking-widest px-8 h-12"
                    >
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>

                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Registered <span className="text-red-500">Participants</span></CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search attendees..."
                                className="pl-10 bg-gray-50 border-none rounded-xl h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Attendee</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Booking Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredAttendees.map((ticket) => (
                                        <tr key={ticket._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-black italic">
                                                        {ticket.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{ticket.user.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{ticket.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-gray-500">
                                                    {new Date(ticket.bookedAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {ticket.checkedIn ? (
                                                    <Badge className="bg-green-500/10 text-green-600 border-none text-[10px] font-black tracking-widest uppercase px-3 py-1">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Checked In
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-gray-100 text-gray-400 border-none text-[10px] font-black tracking-widest uppercase px-3 py-1">
                                                        <QrCode className="h-3 w-3 mr-1" /> Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {!ticket.checkedIn && (
                                                    <Button
                                                        onClick={() => handleCheckIn(ticket._id)}
                                                        disabled={checkingIn === ticket._id}
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white font-black italic uppercase tracking-widest text-[10px] h-9 px-6 rounded-xl transition-all hover:scale-105"
                                                    >
                                                        {checkingIn === ticket._id ? "Processing..." : "Check In"}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAttendees.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-gray-400 italic font-bold">
                                                No attendees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

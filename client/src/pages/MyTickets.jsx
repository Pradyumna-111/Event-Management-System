import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Ticket, Calendar, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function MyTickets({ userInfo }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const userId = userInfo?._id || userInfo?.user?._id;

        const handlePostPayment = async () => {
            if (sessionId) {
                setVerifying(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    await axios.post("http://localhost:5000/api/payments/verify-session", {
                        sessionId,
                        userId
                    }, config);
                    // Remove session_id from URL
                    window.history.replaceState({}, document.title, "/my-tickets");
                } catch (err) {
                    console.error("Verification failed", err);
                } finally {
                    setVerifying(false);
                    fetchTickets(userId);
                }
            } else {
                fetchTickets(userId);
            }
        };

        const fetchTickets = async (uid) => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const res = await axios.get(`http://localhost:5000/api/tickets/user/${uid}`, config);
                setTickets(res.data);
            } catch (err) {
                console.error("Error fetching tickets", err);
            } finally {
                setLoading(false);
            }
        };

        handlePostPayment();
    }, [userInfo, navigate, sessionId]);

    if (loading || verifying) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
             <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
             <p className="font-black italic uppercase tracking-widest text-gray-400 text-sm">
                {verifying ? "Confirming your booking..." : "Loading your tickets..."}
             </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                            My <span className="text-red-500">Tickets</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Your gateway to unforgettable experiences</p>
                    </div>
                    <Button
                        onClick={() => navigate("/")}
                        variant="outline"
                        className="rounded-xl border-2 font-black italic uppercase tracking-widest text-xs h-12 px-8 hover:bg-black hover:text-white transition-all"
                    >
                        Browse More Events
                    </Button>
                </div>

                {tickets.length === 0 ? (
                    <Card className="border-none shadow-2xl rounded-[2.5rem] p-20 text-center bg-white overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                        <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Ticket className="h-12 w-12 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tight text-gray-900 mb-4">No tickets found</h3>
                        <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                            Looks like your calendar is empty. Ready to discover some incredible events and make new memories?
                        </p>
                        <Button
                            className="bg-red-500 hover:bg-red-600 rounded-2xl px-12 h-14 font-black italic uppercase tracking-widest shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95"
                            onClick={() => navigate("/")}
                        >
                            Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tickets.map(ticket => (
                            <Card key={ticket._id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group bg-white">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="md:w-48 bg-gray-900 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#F5F5F5] rounded-full hidden md:block"></div>
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#F5F5F5] rounded-full hidden md:block"></div>

                                        <span className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">
                                            {new Date(ticket.event?.date).toLocaleDateString(undefined, { month: 'short' })}
                                        </span>
                                        <span className="text-5xl font-black italic">
                                            {new Date(ticket.event?.date).toLocaleDateString(undefined, { day: '2-digit' })}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400 mt-2">
                                            {new Date(ticket.event?.date).getFullYear()}
                                        </span>
                                    </div>

                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 group-hover:text-red-500 transition-colors">
                                                    {ticket.event?.title}
                                                </h3>
                                                <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                                    <MapPin className="h-4 w-4 text-red-500" />
                                                    {ticket.event?.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                                    <Calendar className="h-4 w-4 text-red-500" />
                                                    {ticket.event?.time || "07:00 PM onwards"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-dashed flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booking ID</span>
                                                <span className="font-mono text-sm font-bold text-gray-600">#{ticket._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <Button variant="ghost" className="text-red-500 font-black italic uppercase tracking-widest text-xs hover:bg-red-50 rounded-xl">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

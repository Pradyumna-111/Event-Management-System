import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Ticket, Calendar, MapPin, ArrowRight, Loader2, CheckCircle2, Download, QrCode } from "lucide-react";
import { jsPDF } from "jspdf";

export default function MyTickets({ userInfo }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const userId = userInfo?._id || userInfo?.user?._id;

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

        fetchTickets(userId);
    }, [userInfo, navigate]);

    const downloadCertificate = (ticket) => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        // Background
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 0, 297, 210, "F");

        // Border
        doc.setDrawColor(239, 68, 68); // Red-500
        doc.setLineWidth(5);
        doc.rect(10, 10, 277, 190);

        // Content
        doc.setTextColor(17, 24, 39); // Gray-900
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICATE OF PARTICIPATION", 148.5, 60, { align: "center" });

        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("This is to certify that", 148.5, 85, { align: "center" });

        doc.setFontSize(30);
        doc.setFont("helvetica", "bolditalic");
        doc.setTextColor(239, 68, 68);
        doc.text(userInfo.name.toUpperCase(), 148.5, 105, { align: "center" });

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully participated in the event", 148.5, 125, { align: "center" });

        doc.setFontSize(25);
        doc.setFont("helvetica", "bold");
        doc.text(ticket.event.title.toUpperCase(), 148.5, 145, { align: "center" });

        doc.setFontSize(15);
        doc.text(`Date: ${new Date(ticket.event.date).toDateString()}`, 148.5, 160, { align: "center" });
        doc.text(`Location: ${ticket.event.location}`, 148.5, 170, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175);
        doc.text(`Ticket ID: ${ticket._id}`, 148.5, 190, { align: "center" });

        doc.save(`${ticket.event.title}_Certificate.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
             <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
             <p className="font-black italic uppercase tracking-widest text-gray-400 text-sm">
                Loading your tickets...
             </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
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
                    <div className="grid grid-cols-1 gap-8">
                        {tickets.map(ticket => (
                            <Card key={ticket._id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group bg-white">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="md:w-64 bg-gray-900 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#F5F5F5] rounded-full hidden md:block"></div>
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#F5F5F5] rounded-full hidden md:block"></div>

                                        {ticket.qrCode ? (
                                            <div className="bg-white p-2 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-500">
                                                <img src={ticket.qrCode} alt="Ticket QR" className="w-32 h-32" />
                                            </div>
                                        ) : (
                                            <QrCode className="w-32 h-32 text-gray-700 mb-4" />
                                        )}
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Scan for Entry</span>
                                    </div>

                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 group-hover:text-red-500 transition-colors">
                                                        {ticket.event?.title}
                                                    </h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase">
                                                            {ticket.event?.category}
                                                        </Badge>
                                                        {ticket.checkedIn && (
                                                            <Badge className="bg-blue-500 text-white border-none text-[10px] font-black tracking-widest uppercase">
                                                                Checked In
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1.5 text-[10px] font-black tracking-widest uppercase shrink-0">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-sm mt-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</span>
                                                    <span className="text-gray-900 font-bold">{new Date(ticket.event?.date).toDateString()}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Time</span>
                                                    <span className="text-gray-900 font-bold">{ticket.event?.time || "07:00 PM onwards"}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Location</span>
                                                    <span className="text-gray-900 font-bold">{ticket.event?.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-dashed flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booking ID</span>
                                                <span className="font-mono text-sm font-bold text-gray-600">#{ticket._id.toUpperCase()}</span>
                                            </div>
                                            <div className="flex gap-3 w-full md:w-auto">
                                                <Button
                                                    onClick={() => downloadCertificate(ticket)}
                                                    className="flex-1 md:flex-none bg-gray-900 hover:bg-black text-white font-black italic uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl gap-2"
                                                >
                                                    <Download className="h-4 w-4" /> Certificate
                                                </Button>
                                                <Button
                                                    onClick={() => navigate(`/events/${ticket.event?._id}`)}
                                                    variant="ghost"
                                                    className="flex-1 md:flex-none text-red-500 font-black italic uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-red-50 rounded-xl"
                                                >
                                                    View Event
                                                </Button>
                                            </div>
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

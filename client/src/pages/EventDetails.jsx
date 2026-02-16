import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Calendar, MapPin, Share2, Heart, Shield, Clock, Users, ChevronLeft, CreditCard } from "lucide-react";

function EventDetails({ userInfo }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error("Error fetching event details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBookTicket = async () => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        try {
            const token = userInfo.token;
            const res = await axios.post(
                "http://localhost:5000/api/payments/create-checkout-session",
                { eventId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error("Payment Error", err);
            alert("❌ Payment Initialization Failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Event Not Found</h2>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
    );

    const eventDate = new Date(event.date);

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Banner */}
            <section className="relative h-[40vh] md:h-[60vh] overflow-hidden bg-gray-900">
                <img
                    src={event.banner || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1470&q=80"}
                    className="w-full h-full object-cover opacity-50 blur-sm scale-105"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>

                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8 items-end">
                        <div className="hidden md:block aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2">
                            <img
                                src={event.image || event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                                className="w-full h-full object-cover"
                                alt={event.title}
                            />
                        </div>
                        <div className="md:col-span-2 pb-8">
                            <Badge className="bg-red-500 text-white font-black uppercase text-xs tracking-widest px-4 py-1.5 mb-6 border-none">
                                {event.category}
                            </Badge>
                            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg mb-6 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-white font-bold drop-shadow-md">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-red-500" />
                                    <span>{eventDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="absolute top-6 left-6 text-white hover:bg-white/10 gap-2 font-bold"
                    onClick={() => navigate("/")}
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </Button>
            </section>

            {/* Content Section */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Left Column: Info */}
                    <div className="md:col-span-2 space-y-12">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-3xl font-black italic uppercase tracking-tight text-gray-900 mb-6 flex items-center gap-3">
                                About the <span className="text-red-500">Event</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                {event.description || "No description provided for this event. Join us for an incredible experience that you won't want to miss!"}
                            </p>
                        </div>

                        {/* Features/Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: <Clock />, label: "3 Hours" },
                                { icon: <Users />, label: "All Ages" },
                                { icon: <CreditCard />, label: "Stripe Secure" },
                                { icon: <Shield />, label: "Verified" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
                                    <div className="text-red-500 mb-2">{item.icon}</div>
                                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking */}
                    <div className="relative">
                        <Card className="sticky top-24 border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="bg-gray-900 p-8 text-white">
                                <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">Total Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black italic uppercase tracking-tighter">₹{event.price}</span>
                                    <span className="text-gray-400 text-sm font-bold italic uppercase tracking-widest">/ Ticket</span>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-500 uppercase tracking-widest">Date</span>
                                        <span className="text-gray-900">{eventDate.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-500 uppercase tracking-widest">Time</span>
                                        <span className="text-gray-900">07:00 PM onwards</span>
                                    </div>
                                    <div className="h-px bg-gray-100"></div>
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-500 uppercase tracking-widest">Platform Fee</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-red-500 hover:bg-red-600 h-14 rounded-xl text-lg font-black italic uppercase tracking-widest shadow-lg shadow-red-100"
                                    onClick={handleBookTicket}
                                >
                                    Book Now
                                </Button>

                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                    Secure payment powered by Stripe
                                </p>

                                <div className="flex justify-center gap-4 pt-4 border-t border-gray-50">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500"><Share2 className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500"><Heart className="h-5 w-5" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EventDetails;

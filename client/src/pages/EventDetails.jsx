import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
    Calendar, MapPin, Share2, Heart, Shield, Clock,
    Users, ChevronLeft, CreditCard, Star, MessageCircle,
    Facebook, Twitter, Linkedin
} from "lucide-react";

function EventDetails({ userInfo }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [ratingMessage, setRatingMessage] = useState("");

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

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBookTicket = async () => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const resScript = await loadRazorpayScript();

        if (!resScript) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const token = userInfo.token;
            // Create Order on Backend
            const { data: order } = await axios.post(
                "http://localhost:5000/api/payments/create-order",
                { eventId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock",
                amount: order.amount,
                currency: order.currency,
                name: "Event Platform",
                description: `Ticket for ${event.title}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            "http://localhost:5000/api/payments/verify-payment",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyRes.data.success) {
                            alert("✅ Ticket Booked Successfully!");
                            navigate("/my-tickets");
                        }
                    } catch (error) {
                        console.error("Verification failed", error);
                        alert("❌ Payment verification failed!");
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                },
                theme: {
                    color: "#EF4444",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error("Payment Error", err);
            alert("❌ Payment Initialization Failed");
        }
    };

    const handleAddRating = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            navigate("/login");
            return;
        }

        try {
            const token = userInfo.token;
            await axios.post(
                `http://localhost:5000/api/events/${id}/ratings`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatingMessage("✅ Thank you for your feedback!");
            setComment("");
            fetchEvent();
        } catch (err) {
            setRatingMessage(err.response?.data.message || "❌ Failed to add rating");
        }
    };

    const shareOnSocial = (platform) => {
        const url = window.location.href;
        const text = `Check out this event: ${event.title}`;
        let shareUrl = "";

        if (platform === "facebook") {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (platform === "twitter") {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else if (platform === "linkedin") {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        }

        window.open(shareUrl, "_blank", "width=600,height=400");
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
                    src={event.banner || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1470&q=80"}
                    className="w-full h-full object-cover opacity-50 blur-sm scale-105"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>

                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8 items-end">
                        <div className="hidden md:block aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2">
                            <img
                                src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
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
                                {event.description}
                            </p>
                        </div>

                        {/* Sessions */}
                        {event.sessions && event.sessions.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-3xl font-black italic uppercase tracking-tight text-gray-900 mb-6 flex items-center gap-3">
                                    Event <span className="text-red-500">Schedule</span>
                                    <div className="h-px flex-1 bg-gray-100"></div>
                                </h2>
                                <div className="space-y-4">
                                    {event.sessions.map((session, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start">
                                            <div className="bg-red-100 text-red-500 p-3 rounded-xl">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{session.title}</h3>
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{session.time} • Speaker: {session.speaker}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ratings & Feedback */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-3xl font-black italic uppercase tracking-tight text-gray-900 mb-6 flex items-center gap-3">
                                Feedback & <span className="text-red-500">Ratings</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </h2>

                            {/* Feedback Form */}
                            {userInfo && (
                                <form onSubmit={handleAddRating} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold mb-4 uppercase tracking-widest text-sm">Leave a Review</h3>
                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                className={`p-1 transition-colors ${rating >= s ? "text-yellow-400" : "text-gray-300"}`}
                                            >
                                                <Star className="h-6 w-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full p-4 border rounded-xl outline-none focus:border-red-500 text-sm mb-4"
                                        placeholder="Share your thoughts about the event..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="3"
                                    ></textarea>
                                    <Button type="submit" className="bg-gray-900 text-white font-bold px-6">Submit Feedback</Button>
                                    {ratingMessage && <p className="mt-2 text-sm font-bold">{ratingMessage}</p>}
                                </form>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {event.ratings && event.ratings.length > 0 ? (
                                    event.ratings.map((r, i) => (
                                        <div key={i} className="p-6 border rounded-2xl bg-white shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex gap-1 text-yellow-400">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} className={`h-4 w-4 ${idx < r.rating ? "fill-current" : "text-gray-200"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-600 font-medium italic">"{r.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic font-bold text-center py-8">No reviews yet. Be the first to rate this event!</p>
                                )}
                            </div>
                        </div>

                        {/* Features/Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
                            {[
                                { icon: <Clock />, label: event.time || "Full Day" },
                                { icon: <Users />, label: `Capacity: ${event.capacity}` },
                                { icon: <CreditCard />, label: "Razorpay Secure" },
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
                                        <span className="text-gray-900">{event.time || "Check schedule"}</span>
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
                                    Secure payment powered by Razorpay
                                </p>

                                <div className="pt-6 border-t border-gray-50">
                                    <p className="text-xs font-black uppercase tracking-widest text-center text-gray-400 mb-4">Share this event</p>
                                    <div className="flex justify-center gap-4">
                                        <Button onClick={() => shareOnSocial("facebook")} variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600"><Facebook className="h-5 w-5" /></Button>
                                        <Button onClick={() => shareOnSocial("twitter")} variant="ghost" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500"><Twitter className="h-5 w-5" /></Button>
                                        <Button onClick={() => shareOnSocial("linkedin")} variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700"><Linkedin className="h-5 w-5" /></Button>
                                    </div>
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

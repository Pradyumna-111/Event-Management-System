import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin } from "lucide-react";

function EventCard({ event }) {
    const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return (
        <Link to={`/events/${event._id}`} className="block group">
            <Card className="overflow-hidden border-none shadow-sm rounded-2xl bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                        src={event.banner || event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-white/90 hover:bg-white text-gray-900 font-black uppercase text-[10px] tracking-widest px-3 border-none backdrop-blur-sm">
                            {event.category || "Event"}
                        </Badge>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                        <div className="animate-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center gap-1.5 text-red-500 mb-2">
                                <Calendar className="h-3 w-3 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{formattedDate}</span>
                            </div>
                            <h3 className="text-white text-xl font-black italic uppercase leading-tight tracking-tight line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
                                {event.title}
                            </h3>
                        </div>
                    </div>
                </div>
                <CardContent className="p-4 bg-white">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                        <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                        <span className="text-xs font-bold truncate">{event.location}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                        <p className="text-lg font-black text-gray-900">
                            <span className="text-xs text-gray-400 font-bold mr-1">FROM</span>
                            ₹{event.price || "Free"}
                        </p>
                        <Badge variant="outline" className="border-red-100 text-red-500 font-black text-[10px] uppercase tracking-tighter group-hover:bg-red-500 group-hover:text-white transition-colors">
                            BOOK NOW
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default EventCard;

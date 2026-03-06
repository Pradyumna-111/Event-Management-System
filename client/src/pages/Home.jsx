import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import ChatbotWidget from "../components/ChatbotWidget";
import axios from "axios";
import { Button } from "../components/ui/button";
import { ChevronRight, Filter, Search, Calendar } from "lucide-react";

function Home({ userInfo }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:5000/api/events";
            const params = new URLSearchParams();
            if (activeCategory !== "All") params.append("category", activeCategory);
            if (searchTerm) params.append("search", searchTerm);
            if (dateFilter) params.append("date", dateFilter);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await axios.get(url);
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [activeCategory, dateFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    const categories = ["All", "Music", "Tech", "Business", "Sports", "Arts", "Health", "Education", "Other"];

    return (
        <div className="min-h-screen bg-[#F5F5F5] pb-12">
            {/* Hero Section */}
            <section className="bg-[#EBEBEB] py-6 md:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-2xl group">
                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1470&q=80"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Featured Event"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-12">
                            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <h2 className="text-white text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                                    Grand Music Festival <span className="text-red-500">2025</span>
                                </h2>
                                <p className="text-white/80 text-base md:text-xl font-medium mb-6 line-clamp-2">
                                    Experience the magic of live music under the stars. Join thousands for an unforgettable night of rhythm and lights.
                                </p>
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-black italic uppercase tracking-widest px-8 h-12 rounded-none">
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Search & Categories */}
            <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full pl-10 pr-4 py-2 border rounded-full outline-none focus:border-red-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="hidden">Search</button>
                        </form>
                        <div className="relative w-full md:w-48">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border rounded-full outline-none focus:border-red-500 text-sm"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
                        <div className="flex items-center gap-2 text-gray-400 mr-2 shrink-0">
                            <Filter className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Categories</span>
                        </div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-1.5 rounded-full text-sm font-bold transition-all border ${
                                    activeCategory === cat
                                    ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-100"
                                    : "bg-gray-50 text-gray-600 border-gray-100 hover:border-red-200 hover:text-red-500"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-3">
                            {activeCategory === "All" ? "Upcoming" : activeCategory} <span className="text-red-500">Events</span>
                        </h2>
                        <div className="h-1 w-20 bg-red-500 mt-2"></div>
                    </div>
                    <Button variant="link" className="text-red-500 font-bold gap-1 group" onClick={() => {setActiveCategory("All"); setSearchTerm(""); setDateFilter("");}}>
                        Reset All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="aspect-[2/3] rounded-2xl bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-xl font-bold text-gray-400 italic">No events found matching your criteria.</p>
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={() => {setActiveCategory("All"); setSearchTerm(""); setDateFilter("");}}>Clear Filters</Button>
                    </div>
                )}
            </main>

            <ChatbotWidget />
        </div>
    );
}

export default Home;

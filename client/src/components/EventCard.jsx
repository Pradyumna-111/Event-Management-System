function EventCard({ event, onBook }) {
    return (
        <div
            className="bg-white rounded-md overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col h-full"
            onClick={() => onBook && onBook(event._id)}
        >
            {/* Banner */}
            <div className="relative h-64 bg-gray-200">
                <img
                    src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 flex justify-between">
                    <span>{new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                    <span>{event.location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-base font-bold text-gray-800 truncate" title={event.title}>{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">{event.category || "Event"}</p>

                <div className="mt-auto pt-3 border-t">
                    <p className="text-sm font-bold text-gray-700">₹{event.price || "Free"}</p>
                    <button
                        className="mt-2 w-full border border-red-500 text-red-500 py-1.5 rounded text-sm font-medium hover:bg-red-50 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBook && onBook(event._id);
                        }}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventCard;

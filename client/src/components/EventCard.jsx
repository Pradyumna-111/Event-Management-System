function EventCard({ event }) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
            {/* Banner */}
            {event.banner && (
                <img
                    src={event.banner}
                    alt={event.title}
                    className="w-full h-60 object-contain bg-gray-100"
                />
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                    📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                    Get Ticket
                </button>
            </div>
        </div>
    );
}

export default EventCard;

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    time: { type: String, required: true },
});

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true, default: "General" },
        date: { type: Date, required: true },
        time: { type: String },
        location: { type: String, required: true },
        capacity: { type: Number, default: 100 },
        price: { type: Number, default: 0 },
        banner: { type: String }, // image url
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessions: [sessionSchema],
        ratings: [ratingSchema],
    },
    { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;

import { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react"; // nice icons

function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I'm your Event Assistant! How can I help you?" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        // add user message
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);

        const userMessage = input;
        setInput("");

        try {
            // 🔌 Replace with your chatbot backend endpoint
            const res = await axios.post("http://localhost:5000/api/chatbot", {
                message: userMessage,
            });

            const botReply = res.data.reply || "Sorry, I didn’t understand that.";
            setMessages([...newMessages, { sender: "bot", text: botReply }]);
        } catch (err) {
            console.error("Chatbot error", err);
            setMessages([
                ...newMessages,
                { sender: "bot", text: "⚠️ Server is offline. Please try again later." },
            ]);
        }
    };

    return (
        <div>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chatbox */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg rounded-xl flex flex-col border">
                    <div className="bg-indigo-600 text-white p-3 rounded-t-xl">
                        <h2 className="text-lg font-semibold">Event Assistant</h2>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-80">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg text-sm ${
                                    msg.sender === "user"
                                        ? "bg-indigo-100 self-end text-right"
                                        : "bg-gray-100 text-left"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatbotWidget;

'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";
import { motion } from "framer-motion";

export default function AiDoctorPage() {
    const { user } = AuthData();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const local = localStorage.getItem("chat");
        if (local) setMessages(JSON.parse(local));
    }, []);

    useEffect(() => {
        localStorage.setItem("chat", JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await api.post(`/user/${user.id}/ai-doctor`, { query: input });
            const aiMsg = { role: "ai", text: res.data.response };
            setMessages([...res.data.history]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", text: "❌ Failed to respond" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="p-6 flex flex-col h-screen">
            <h1 className="text-2xl font-bold mb-4">👨‍⚕️ AI Doctor</h1>

            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`px-4 py-2 max-w-sm text-sm rounded-xl ${
                            msg.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="text-sm text-gray-400">AI is typing...</div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Describe your issue..."
                    className="flex-1 p-2 border rounded"
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}

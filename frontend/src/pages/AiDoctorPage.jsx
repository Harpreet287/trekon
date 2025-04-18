'use client';

import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AiDoctorPage.css";

export default function AiDoctorPage() {
    const { user } = AuthData();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedPrompts = [
        "What are symptoms of dehydration?",
        "How can I reduce stress?",
        "Recommend exercises for back pain",
        "Diet advice for weight loss"
    ];

    useEffect(() => {
        const local = localStorage.getItem("chat");
        if (local) setMessages(JSON.parse(local));
    }, []);

    useEffect(() => {
        localStorage.setItem("chat", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem("chat");
    };

    const sendMessage = async (messageText = input) => {
        if (!messageText.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { role: "user", text: messageText, time: timestamp };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await api.post(`/user/${user.id}/ai-doctor`, { query: messageText });
            
            // Add timestamp to the AI response
            const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Create a new response history with timestamps
            const updatedHistory = res.data.history.map(msg => {
                if (!msg.time) {
                    return {
                        ...msg,
                        time: msg.role === "user" ? timestamp : aiTimestamp
                    };
                }
                return msg;
            });
            
            setMessages(updatedHistory);
        } catch (error) {
            setMessages((prev) => [
                ...prev, 
                { 
                    role: "ai", 
                    text: "I'm sorry, I couldn't process your request. Please try again later.", 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            console.error("AI Doctor error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handlePromptClick = (prompt) => {
        sendMessage(prompt);
    };

    return (
        <div className="ai-doctor-container">
            <div className="ai-doctor-content">
                <div className="ai-doctor-header">
                    <div className="ai-doctor-title">
                        👨‍⚕️ AI Doctor
                    </div>
                    {messages.length > 0 && (
                        <div className="ai-doctor-actions">
                            <button onClick={clearChat} className="clear-button">
                                <span>Clear chat</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="chat-container">
                    {messages.length === 0 ? (
                        <div className="empty-chat">
                            <div className="empty-chat-icon">👨‍⚕️</div>
                            <h3 className="empty-chat-title">Welcome to AI Doctor</h3>
                            <p className="empty-chat-description">
                                Ask any health-related questions and get professional medical advice. 
                                Your conversations are private and secured.
                            </p>
                            <div className="suggested-prompts">
                                {suggestedPrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        className="prompt-pill"
                                        onClick={() => handlePromptClick(prompt)}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="messages-container">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`message-wrapper ${msg.role}`}
                                    >
                                        <div className={`message-bubble ${msg.role}`}>
                                            {msg.text}
                                            {msg.time && (
                                                <div className="message-time">{msg.time}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="typing-indicator"
                                >
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    <div className="chat-input-container">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask your health question..."
                            className="chat-input"
                        />
                        <button 
                            onClick={() => sendMessage()}
                            className="send-button"
                            disabled={!input.trim() || isTyping}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

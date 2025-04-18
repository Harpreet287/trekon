'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper"; // your custom hook/context
import { motion, AnimatePresence } from "framer-motion"; // For animations
import "./Habits.css";

function Habits() {
    const { user } = AuthData();
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState("");
    const [userData, setUserData] = useState({ name: "User" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (user?.id) {
            fetchHabits();
            fetchUserDetails();
        }
    }, [user]);

    const fetchHabits = async () => {
        try {
            const res = await api.get(`/user/${user.id}/habit`);
            setHabits(res.data.userhabits);
        } catch (err) {
            console.error("Failed to fetch habits:", err);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const res = await api.get(`/user/${user.id}`);
            setUserData(res.data);
        } catch (err) {
            console.error("Failed to fetch user details:", err);
        }
    };

    const handleAddHabit = async () => {
        if (!newHabit.trim()) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Step 1: Create habit in global habit collection
            const create = await api.post("/habit", { description: newHabit });

            // Step 2: Attach habit to user
            await api.post(`/user/${user.id}/habit`, {
                habitId: create.data.id
            });

            setNewHabit("");
            fetchHabits();
        } catch (err) {
            setError("Failed to add habit. Please try again.");
            console.error("Failed to add habit:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (habitId) => {
        await api.delete(`/user/${user.id}/habit`, {
            data: { habitId },
        });
        fetchHabits();
    };

    return (
        <motion.div 
            className="habits-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated background */}
            <div className="habits-background">
                {/* Particle effects */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="habits-particle"
                        style={{
                            width: Math.random() * 4 + 1 + "px",
                            height: Math.random() * 4 + 1 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.3 + 0.1
                        }}
                        animate={{
                            y: [0, -(Math.random() * 150 + 50)],
                            opacity: [0.1, 0.3, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
                
                {/* Animated light orbs */}
                <motion.div 
                    className="habits-orb habits-orb-blue"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="habits-orb habits-orb-purple"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="habits-gradient-overlay"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </div>

            <motion.div 
                className="habits-content"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <motion.div 
                    className="habits-title"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <h1>Habits for {user.firstName}</h1>
                </motion.div>
                
                <div className="habits-input-section">
                    <div className="habits-input-card">
                        <div className="habits-input-wrapper">
                            <motion.input
                                type="text"
                                className="habits-input"
                                value={newHabit}
                                onChange={(e) => setNewHabit(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddHabit();
                                    }
                                }}
                                placeholder="Add a new habit..."
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                            />
                        </div>
                        <div className="habits-button-container">
                            <motion.button
                                className="habits-add-button"
                                onClick={handleAddHabit}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                disabled={isLoading}
                            >
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            className="habits-button-content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.svg 
                                                className="habits-spinner" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24"
                                                animate={{ rotate: 360 }}
                                                transition={{ 
                                                    duration: 1.5, 
                                                    repeat: Infinity, 
                                                    ease: "linear" 
                                                }}
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </motion.svg>
                                            <span>Adding...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="default"
                                            className="habits-button-content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <span>Add</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="habits-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="habits-list">
                    <div className="habits-list-grid">
                        <AnimatePresence mode="popLayout">
                            {habits.map((h) => (
                                <motion.div 
                                    key={h.habitId} 
                                    className="habit-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="habit-text">
                                        <p>{h.description}</p>
                                        {/*<p className="text-xs text-gray-500">Status: {h.status}</p>*/}
                                    </div>
                                    <motion.button
                                        onClick={() => handleDelete(h.habitId)}
                                        className="habit-delete-button"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label="Delete habit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Habits;

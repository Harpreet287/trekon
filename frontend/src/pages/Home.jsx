'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";
import "./Home.css";
import yogaImage from "./yoga.png";

function Home() {
    const { user } = AuthData();
    const [habits, setHabits] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [tab, setTab] = useState("incomplete");


    useEffect(() => {
        if (user?.id) {
            fetchHabits();
            fetchWorkouts();
        }
    }, [user]);

    const fetchHabits = async () => {
        try {
            const res = await api.get(`/user/${user.id}/habit`);
            console.log("Fetched habits:", res.data);
            setHabits(res.data.userhabits || []);
        } catch (error) {
            console.error("Error fetching habits:", error);
            setHabits([]);
        }
    };

    const fetchWorkouts = async () => {
        try {
            const res = await api.get(`/user/${user.id}/workout`);
            setWorkouts(res.data.userWorkouts || []);
        } catch (error) {
            console.error("Error fetching workouts:", error);
            setWorkouts([]);
        }
    };

    const isToday = (dateStr) => {
        const today = new Date().toISOString().slice(0, 10);
        const dateOnly = new Date(dateStr).toISOString().slice(0, 10);
        return dateOnly === today;
    };

    const handleHabitToggle = async (habitId, isChecked) => {
        const url = `/user/${user.id}/checkHabit`;
        try {
            if (isChecked) {
                await api.post(url, { habitId });
            } else {
                await api.delete(url, { data: { habitId } });
            }
            fetchHabits();
        } catch (error) {
            console.error("Error toggling habit:", error);
        }
    };

    const toggleTab = (value) => setTab(value);

    const toggleHabitCompletion = async (habit) => {
        const completedToday = habit.completedDates.some(date => isToday(date));
        await handleHabitToggle(habit.habitId, !completedToday);
    };

    const toggleWorkoutCompletion = async (workout) => {
        const completedToday = workout.completedDates.some(date => isToday(date));
        try {
            if (completedToday) {
                await api.delete(`/user/${user.id}/checkWorkout`, {
                    data: { workoutId: workout.workoutId },
                });
            } else {
                await api.post(`/user/${user.id}/checkWorkout`, {
                    workoutId: workout.workoutId,
                });
            }
            fetchWorkouts(); // Refresh
        } catch (error) {
            console.error("Error toggling workout:", error);
        }
    };

    return (
        <div className="home-container">
            <div className="dashboard-layout">
                <div className="content-area">
                    <div className="header-card">
                        <div className="header-content">
                            <div className="user-welcome">
                                <div className="user-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="user-greeting">
                                    <h1>Hello, {user?.firstName || 'User'}!</h1>
                                    <p className="greeting-subtitle">Track your progress and stay motivated</p>
                                </div>
                            </div>
                            <div className="progress-summary">
                                <div className="progress-item">
                                    <span className="progress-label">Today's habits for you</span>
                                    <span className="progress-value">{habits.filter(h => !h.completedDates.some(date => isToday(date))).length}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">Today's workouts</span>
                                    <span className="progress-value">{workouts.filter(w => !w.completedDates.some(date => isToday(date))).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-container">
                        <button 
                            onClick={() => toggleTab("incomplete")} 
                            className={`tab-button ${tab === "incomplete" ? "active" : ""}`}
                        >
                            <span>Incomplete</span>
                        </button>
                        <button 
                            onClick={() => toggleTab("completed")} 
                            className={`tab-button ${tab === "completed" ? "active" : ""}`}
                        >
                            <span>Completed</span>
                        </button>
                    </div>

                    <div className="content-section habits-section">
                        <h2 className="section-title">Habits</h2>
                        <div className="card-container">
                            {habits.length === 0 ? (
                                <div className="empty-state-card">
                                    <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p>No habits found. Start by adding some healthy habits!</p>
                                </div>
                            ) : (
                                <div className="cards-grid">
                                    {habits.map((habit) => {
                                        const completedToday = habit.completedDates.some(date => isToday(date));
                                        const show = (tab === "completed" && completedToday) || (tab === "incomplete" && !completedToday);
                                        
                                        return show ? (
                                            <div 
                                                key={habit.habitId} 
                                                className={`habit-card ${completedToday ? 'completed' : 'pending'}`}
                                                onClick={() => toggleHabitCompletion(habit)}
                                            >
                                                <div className="card-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id={`habit-${habit.habitId}`}
                                                        checked={completedToday}
                                                        onChange={(e) => handleHabitToggle(habit.habitId, e.target.checked)}
                                                        className="custom-checkbox"
                                                    />
                                                    <label htmlFor={`habit-${habit.habitId}`} className="checkbox-label"></label>
                                                </div>
                                                <div className="card-content">
                                                    <h3 className={`habit-title ${completedToday ? 'completed' : 'pending'}`}>
                                                        {habit.description}
                                                    </h3>
                                                    <div className="card-meta">
                                                        <span className="badge badge-gray">{habit.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="content-section workouts-section">
                        <h2 className="section-title">Workouts</h2>
                        <div className="card-container">
                            {workouts.length === 0 ? (
                                <div className="empty-state-card">
                                    <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p>No workouts found. Start by adding some exercise routines!</p>
                                </div>
                            ) : (
                                <div className="cards-grid">
                                    {workouts.map((workout) => {
                                        const completedToday = workout.completedDates.some(date => isToday(date));
                                        const show = (tab === "completed" && completedToday) || (tab === "incomplete" && !completedToday);
                                        
                                        return show ? (
                                            <div 
                                                key={workout.workoutId} 
                                                className={`workout-card ${completedToday ? 'completed' : 'pending'}`}
                                                onClick={() => toggleWorkoutCompletion(workout)}
                                            >
                                                <div className="card-header">
                                                    <h3 className={`workout-title ${completedToday ? 'completed' : ''}`}>
                                                        {workout.name}
                                                    </h3>
                                                    <span className="badge badge-blue">{workout.type}</span>
                                                </div>
                                                <div className="card-body">
                                                    <p className="workout-description">
                                                        {workout.description}
                                                    </p>
                                                </div>
                                                <div className={`workout-difficulty workout-difficulty-${(workout.difficulty || 'medium').toLowerCase()}`}>
                                                    {workout.difficulty}
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="image-sidebar">
                    <img 
                        src={yogaImage} 
                        alt="Yoga Pose" 
                        className="home-image"
                    />
                    <div className="motivational-text">
                        <h3>Stay consistent</h3>
                        <p>Building healthy habits takes time and dedication.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

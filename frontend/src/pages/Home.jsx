'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";

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
        const res = await api.get(`/user/${user.id}/habit`);

        console.log("Fetched habits:", res.data);

        setHabits(res.data.userhabits || []);
    };

    const fetchWorkouts = async () => {
        const res = await api.get(`/user/${user.id}/workout`);
        setWorkouts(res.data.userWorkouts || []);
    };

    const isToday = (dateStr) => {
        const today = new Date().toISOString().slice(0, 10);
        const dateOnly = new Date(dateStr).toISOString().slice(0, 10);
        return dateOnly === today;
    };


    const handleHabitToggle = async (habitId, isChecked) => {
        const url = `/user/${user.id}/checkHabit`;
        if (isChecked) {
            await api.post(url, { habitId });
        } else {
            await api.delete(url, { data: { habitId } });
        }
        fetchHabits();

    };

    const toggleTab = (value) => setTab(value);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hello, {user.firstName}!</h1>

            <div className="flex gap-4 mb-6">
                <button onClick={() => toggleTab("incomplete")} className={tab === "incomplete" ? "font-bold" : ""}>
                    Incomplete
                </button>
                <button onClick={() => toggleTab("completed")} className={tab === "completed" ? "font-bold" : ""}>
                    Completed
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">Habits</h2>
                {habits.map((habit) => {
                    const completedToday = habit.completedDates.some(date => isToday(date));
                    const show = (tab === "completed" && completedToday) || (tab === "incomplete" && !completedToday);
                    console.log(habit.completedDates);
                    return show ? (
                        <div key={habit.habitId} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={completedToday}
                                onChange={(e) => handleHabitToggle(habit.habitId, e.target.checked)}
                            />
                            <span>{habit.description}</span>
                            <span>{habit.status}</span>
                        </div>
                    ) : null;
                })}
            </div>

            <div>
                <h2 className="text-xl mb-2">Workouts</h2>
                {workouts.map((workout) => {
                    const completedToday = workout.completedDates.some(date => isToday(date));
                    const show = (tab === "completed" && completedToday) || (tab === "incomplete" && !completedToday);

                    return show ? (
                        <div key={workout.workoutId} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={completedToday}
                                onChange={async (e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        await api.post(`/user/${user.id}/checkWorkout`, {
                                            workoutId: workout.workoutId,
                                        });
                                    } else {
                                        await api.delete(`/user/${user.id}/checkWorkout`, {
                                            data: { workoutId: workout.workoutId },
                                        });
                                    }
                                    fetchWorkouts(); // Refresh
                                }}

                            />
                            <span>{workout.name}</span>
                            <span>{workout.status}</span>
                            <span>{workout.description}</span>
                            <span>{workout.difficulty}</span>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
}

export default Home;

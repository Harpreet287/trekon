'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper"; // your custom hook/context

function Habits() {
    const { user } = AuthData();
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState("");

    useEffect(() => {
        if (user?.id) {
            fetchHabits();
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

    const handleAddHabit = async () => {
        if (!newHabit.trim()) return;

        // Step 1: Create habit in global habit collection
        const create = await api.post("/habit", { description: newHabit });

        // Step 2: Attach habit to user
        await api.post(`/user/${user.id}/habit`, {
            habitId: create.data.id
        });

        setNewHabit("");
        fetchHabits();
    };

    const handleDelete = async (habitId) => {
        await api.delete(`/user/${user.id}/habit`, {
            data: { habitId },
        });
        fetchHabits();
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Habits for {user.email}</h1>

            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Add a new habit..."
                />
                <button
                    className="bg-blue-500 text-white px-4 rounded"
                    onClick={handleAddHabit}
                >
                    +
                </button>
            </div>

            <div className="grid gap-3">
                {habits.map((h) => (
                    <div key={h.habitId} className="border p-3 rounded shadow flex justify-between">
                        <div>
                            <p className="font-medium">{h.description}</p>
                            {/*<p className="text-xs text-gray-500">Status: {h.status}</p>*/}
                        </div>
                        <button
                            onClick={() => handleDelete(h.habitId)}
                            className="text-red-500 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Habits;

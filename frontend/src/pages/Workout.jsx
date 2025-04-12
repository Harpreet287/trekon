'use client';

import React, { useEffect, useState } from 'react';
import api from '../utils/api.jsx'; // your Axios wrapper
import { getUserId } from '../utils/auth.jsx'; // get userid from localStorage or context

function Workout() {
    const [allWorkouts, setAllWorkouts] = useState([]);
    const [userWorkouts, setUserWorkouts] = useState(new Set());
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserId(user.id);
            fetchAllWorkouts();
            fetchUserWorkouts(user.id);
        }
    }, []);

    const fetchAllWorkouts = async () => {
        const res = await api.get('/workouts');
        console.log("All workouts" );
        console.log(res.data);
        setAllWorkouts(res.data);
    };

    const fetchUserWorkouts = async (uid) => {
        const res = await api.get(`/user/${uid}/workout`);
        const userWorkoutIds = res.data.userWorkouts.map(w => w.workoutId);
        console.log("User workouts");
        console.log(res.data);
        setUserWorkouts(new Set(userWorkoutIds));
    };

    const handleToggle = async (workoutId, difficulty) => {
        const isSelected = userWorkouts.has(workoutId);
        const url = `/user/${userId}/workout`;

        if (isSelected) {
            await api.delete(url, { data: { workoutId } });
            userWorkouts.delete(workoutId);
        } else {
            await api.post(url, { workoutId, difficulty });
            userWorkouts.add(workoutId);
        }
        setUserWorkouts(new Set(userWorkouts)); // trigger re-render
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Workout Catalog</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allWorkouts.map((workout) => (

                    <div key={workout.id} className="border p-4 rounded shadow">

                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">{workout.name}</h2>
                            <input
                                type="checkbox"
                                checked={userWorkouts.has(workout.id)}
                                onChange={() => handleToggle(workout.id, workout.difficulty)}
                            />
                        </div>
                        <p className="text-sm mb-1">{workout.description}</p>
                        <p className="text-xs text-gray-600">Type: {workout.type} | Target: {workout.target}</p>
                        <p className="text-xs text-gray-500">Difficulty: {workout.difficulty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Workout;

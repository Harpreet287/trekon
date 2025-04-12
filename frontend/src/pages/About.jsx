'use client';

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";

function About() {
    const { user } = AuthData();
    const [profile, setProfile] = useState(null);
    const [editData, setEditData] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchUser();
        }
    }, [user]);

    const fetchUser = async () => {
        const res = await api.get(`/user/${user.id}`);
        setProfile(res.data);
        setEditData({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            age: res.data.age,
            weight: res.data.weight,
            height: res.data.height,
            gender: res.data.gender
        });
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        await api.put(`/user/${user.id}`, editData); // backend should ignore restricted fields
        setEditing(false);
        fetchUser(); // refresh updated data
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="mb-4">
                {editing ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            name="firstName"
                            value={editData.firstName}
                            onChange={handleChange}
                            className="text-3xl font-bold border-b-2 border-gray-400 focus:outline-none"
                        />
                        <input
                            name="lastName"
                            value={editData.lastName}
                            onChange={handleChange}
                            className="text-3xl font-bold border-b-2 border-gray-400 focus:outline-none"
                        />
                    </div>
                ) : (
                    <h1 className="text-3xl font-bold">
                        About {profile.firstName} {profile.lastName}
                    </h1>
                )}
            </div>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Gender:</strong> {editing ? <input name="gender" value={editData.gender} onChange={handleChange} /> : profile.gender}</p>
            <p><strong>Age:</strong> {editing ? <input name="age" type="number" value={editData.age} onChange={handleChange} /> : profile.age}</p>
            <p><strong>Height:</strong> {editing ? <input name="height" type="number" value={editData.height} onChange={handleChange} /> : profile.height} cm</p>
            <p><strong>Weight:</strong> {editing ? <input name="weight" type="number" value={editData.weight} onChange={handleChange} /> : profile.weight} kg</p>

            {editing ? (
                <>
                    <button onClick={saveChanges} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Save</button>
                    <button onClick={() => setEditing(false)} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </>
            ) : (
                <button onClick={() => setEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
            )}
        </div>
    );
}

export default About;

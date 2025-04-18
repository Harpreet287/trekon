import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { AuthData } from "../auth/AuthWrapper.jsx";
import "../styles/UserProfile.css";

function UserProfile() {
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

    if (!profile) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>User Profile</h1>
            </header>
            
            <div className="profile-content">
                <div className="profile-card">
                    {editing ? (
                        <div className="edit-name-container">
                            <input
                                name="firstName"
                                value={editData.firstName}
                                onChange={handleChange}
                                className="edit-name-input"
                                placeholder="First Name"
                            />
                            <input
                                name="lastName"
                                value={editData.lastName}
                                onChange={handleChange}
                                className="edit-name-input"
                                placeholder="Last Name"
                            />
                        </div>
                    ) : (
                        <h2 className="profile-header">
                            {profile.firstName} {profile.lastName}
                        </h2>
                    )}
                    
                    <div className="profile-row">
                        <div className="profile-label">Email</div>
                        <div className="profile-value">{profile.email}</div>
                    </div>
                    
                    <div className="profile-row">
                        <div className="profile-label">Gender</div>
                        <div className="profile-value">
                            {editing ? (
                                <input 
                                    name="gender" 
                                    value={editData.gender} 
                                    onChange={handleChange} 
                                    className="profile-input"
                                />
                            ) : profile.gender}
                        </div>
                    </div>
                    
                    <div className="profile-row">
                        <div className="profile-label">Age</div>
                        <div className="profile-value">
                            {editing ? (
                                <input 
                                    name="age" 
                                    type="number" 
                                    value={editData.age} 
                                    onChange={handleChange} 
                                    className="profile-input"
                                />
                            ) : profile.age}
                        </div>
                    </div>
                    
                    <div className="profile-row">
                        <div className="profile-label">Height</div>
                        <div className="profile-value">
                            {editing ? (
                                <input 
                                    name="height" 
                                    type="number" 
                                    value={editData.height} 
                                    onChange={handleChange} 
                                    className="profile-input"
                                />
                            ) : `${profile.height} cm`}
                        </div>
                    </div>
                    
                    <div className="profile-row">
                        <div className="profile-label">Weight</div>
                        <div className="profile-value">
                            {editing ? (
                                <input 
                                    name="weight" 
                                    type="number" 
                                    value={editData.weight} 
                                    onChange={handleChange} 
                                    className="profile-input"
                                />
                            ) : `${profile.weight} kg`}
                        </div>
                    </div>

                    <div className="profile-actions">
                        {editing ? (
                            <>
                                <button onClick={saveChanges} className="btn btn-success">Save Changes</button>
                                <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;


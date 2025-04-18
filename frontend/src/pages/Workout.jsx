'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api'; 
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { AuthData } from "../auth/AuthWrapper.jsx";
import { useNavigate } from "react-router-dom";
import "./Workout.css";

// Error boundary moved to separate component
import { ErrorBoundary } from "../components/ErrorBoundary";

// Create a new file components/ErrorBoundary.jsx with the ErrorBoundary component
function Workout() {
    console.log("%c Workout component mounting", "background: #2563eb; color: white; padding: 2px 4px; border-radius: 2px;");
    
    // Get auth context
    const { user } = AuthData();
    console.log("%c Authentication state:", "font-weight: bold; color: #2563eb;", {
        user: user,
        isAuthenticated: !!user?.id,
        userDetails: user ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            sessionActive: !!localStorage.getItem('token')
        } : 'No user data'
    });
    
    const navigate = useNavigate();
    
    const [allWorkouts, setAllWorkouts] = useState([]);
    const [userWorkouts, setUserWorkouts] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingWorkouts, setLoadingWorkouts] = useState(new Set());
    const [renderError, setRenderError] = useState(null);
    
    // Set API base URL directly to match the rest of the application
    const apiBaseUrl = 'http://localhost:8080';
    
    // Log API base URL
    useEffect(() => {
        console.log("%c Using API base URL:", "background: #059669; color: white; padding: 2px 4px;", apiBaseUrl);
    }, []);
    // Check authentication
    // Check authentication
    useEffect(() => {
        try {
            console.log("%c Workout component useEffect running", "background: #4b5563; color: white; padding: 2px 4px; border-radius: 2px;");
            
            // Log authentication state from localStorage
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            console.log("%c Authentication data from localStorage:", "color: #6366f1;", {
                token: token ? "Present" : "Missing",
                tokenLength: token ? token.length : 0,
                storedUser: storedUser ? JSON.parse(storedUser) : "No user stored",
                currentUser: user
            });
            
            // Verify token validity
            const isTokenValid = token && token.length > 20; // Basic check that token exists and has reasonable length
            
            if (user && user.id && isTokenValid) {
                console.log("%c User authenticated, proceeding with data fetching", "color: #10b981; font-weight: bold;");
                fetchAllWorkouts();
                fetchUserWorkouts(user.id);
            } else {
                console.warn("%c No authenticated user found, redirecting to login", "color: #f59e0b; font-weight: bold;", {
                    user,
                    token: localStorage.getItem('token')
                });
                setRenderError("Authentication required. Please log in.");
                // Redirect to login after a short delay
                setTimeout(() => {
                    console.log("Redirecting to login page due to missing authentication");
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            console.error("%c Error in Workout component initialization:", "color: #ef4444; font-weight: bold;", err);
            console.error("Error details:", {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
            setRenderError(`Error initializing component: ${err.message}`);
        }
    }, [user, navigate]);

    const fetchAllWorkouts = async () => {
        try {
            console.log("%c Fetching all workouts...", "color: #0ea5e9; font-weight: bold;");
            
            // Create mock data if in development mode
            // if (process.env.NODE_ENV === 'development') {
            //     console.warn("%c DEVELOPMENT MODE: Using mock workout data", "background: #f59e0b; color: black; padding: 2px 4px;");
            //     const mockWorkouts = [
            //         {
            //             id: 1,
            //             name: "Push-Up Challenge",
            //             description: "Complete 3 sets of push-ups with 30 seconds rest between sets. Focus on proper form with chest touching the ground and fully extended arms at the top.",
            //             type: "Strength",
            //             target: "Upper Body",
            //             difficulty: "Medium"
            //         },
            //         {
            //             id: 2,
            //             name: "Mountain Climber HIIT",
            //             description: "Perform mountain climbers for 45 seconds, followed by 15 seconds rest. Repeat for 5 rounds. Keep your core tight and maintain a steady pace.",
            //             type: "Cardio",
            //             target: "Full Body",
            //             difficulty: "Hard"
            //         },
            //         {
            //             id: 3,
            //             name: "Plank Progression",
            //             description: "Hold a plank position for 60 seconds. For beginners, drop to knees if needed. Advanced users can try side planks and plank shoulder taps.",
            //             type: "Strength",
            //             target: "Core",
            //             difficulty: "Medium"
            //         },
            //         {
            //             id: 4,
            //             name: "Bodyweight Squat Routine",
            //             description: "Complete 4 sets of 15 bodyweight squats. Focus on proper form with knees tracking over toes and weight in heels. Add jump squats for extra challenge.",
            //             type: "Strength",
            //             target: "Lower Body",
            //             difficulty: "Easy"
            //         },
            //         {
            //             id: 5,
            //             name: "Burpee Blast",
            //             description: "Complete as many burpees as possible in 2 minutes. Rest for 1 minute and repeat twice more. Focus on controlled movements and full extension.",
            //             type: "Cardio",
            //             target: "Full Body",
            //             difficulty: "Hard"
            //         },
            //         {
            //             id: 6,
            //             name: "Yoga Flow Sequence",
            //             description: "Follow a 10-minute sequence of sun salutations, warrior poses, and gentle stretches. Focus on breathing and maintaining proper alignment throughout.",
            //             type: "Flexibility",
            //             target: "Full Body",
            //             difficulty: "Easy"
            //         }
            //     ];
            //     setAllWorkouts(mockWorkouts);
            //     setError(null);
            //     setIsLoading(false);
            //     return;
            // }
            
            setIsLoading(true);
            
            // Get token for authorization
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            let response = null;
            let error = null;
            
            try {
                // Use the correct endpoint structure to match backend
                const fullUrl = `${apiBaseUrl}/api/workouts`;
                console.log(`%c Calling API endpoint: ${fullUrl}`, "background: #6366f1; color: white; padding: 2px 4px;");
                
                // Make direct axios call to ensure headers are correctly set
                response = await axios.get(fullUrl, { headers });
            } catch (err) {
                console.error("%c API Error:", "background: #ef4444; color: white; padding: 2px 4px;", err);
                error = err;
            }
            
            // If we got a response, process it
            if (response) {
                console.log("API Response:", response);
                console.log("Workouts data structure:", response.data);
                
                // Check if the response has the expected structure
                if (!response.data || !Array.isArray(response.data)) {
                    console.warn("API response doesn't match expected format:", response.data);
                    
                    // Try to handle different API response structures
                    const workoutsData = Array.isArray(response.data) ? response.data : 
                                        response.data?.workouts || 
                                        response.data?.data ||
                                        response.data?.results ||
                                        response.data?.items ||
                                        [];
                    
                    console.log("Normalized workouts data:", workoutsData);
                    
                    // If we have no data or empty array
                    if (workoutsData.length === 0) {
                        if (process.env.NODE_ENV === 'development') {
                        //     console.warn("%c DEVELOPMENT MODE: No workout data found, using mock data", "background: #f59e0b; color: black; padding: 2px 4px;");
                        //     const mockWorkouts = [
                        //         {
                        //             id: 1,
                        //             name: "Push-Up Challenge",
                        //             description: "Complete 3 sets of push-ups with 30 seconds rest between sets. Focus on proper form with chest touching the ground and fully extended arms at the top.",
                        //             type: "Strength",
                        //             target: "Upper Body",
                        //             difficulty: "Medium"
                        //         },
                        //         {
                        //             id: 2,
                        //             name: "Mountain Climber HIIT",
                        //             description: "Perform mountain climbers for 45 seconds, followed by 15 seconds rest. Repeat for 5 rounds. Keep your core tight and maintain a steady pace.",
                        //             type: "Cardio",
                        //             target: "Full Body",
                        //             difficulty: "Hard"
                        //         },
                        //         {
                        //             id: 3,
                        //             name: "Plank Progression",
                        //             description: "Hold a plank position for 60 seconds. For beginners, drop to knees if needed. Advanced users can try side planks and plank shoulder taps.",
                        //             type: "Strength",
                        //             target: "Core",
                        //             difficulty: "Medium"
                        //         },
                        //         {
                        //             id: 4,
                        //             name: "Bodyweight Squat Routine",
                        //             description: "Complete 4 sets of 15 bodyweight squats. Focus on proper form with knees tracking over toes and weight in heels. Add jump squats for extra challenge.",
                        //             type: "Strength",
                        //             target: "Lower Body",
                        //             difficulty: "Easy"
                        //         },
                        //         {
                        //             id: 5,
                        //             name: "Burpee Blast",
                        //             description: "Complete as many burpees as possible in 2 minutes. Rest for 1 minute and repeat twice more. Focus on controlled movements and full extension.",
                        //             type: "Cardio",
                        //             target: "Full Body",
                        //             difficulty: "Hard"
                        //         },
                        //         {
                        //             id: 6,
                        //             name: "Yoga Flow Sequence",
                        //             description: "Follow a 10-minute sequence of sun salutations, warrior poses, and gentle stretches. Focus on breathing and maintaining proper alignment throughout.",
                        //             type: "Flexibility",
                        //             target: "Full Body",
                        //             difficulty: "Easy"
                        //         }
                        //     ];
                        //     setAllWorkouts(mockWorkouts);
                        } else {
                            console.warn("No workout data found in API response");
                            setAllWorkouts([]);
                        }
                    } else {
                        setAllWorkouts(workoutsData);
                    }
                } else {
                    console.log("%c Using data directly from response", "color: #10b981;");
                    setAllWorkouts(response.data);
                }
                
                setError(null);
            } else if (error) {
                // Handle the error if none of the endpoints worked
                console.error("All API endpoint attempts failed:", error);
                
                // Create detailed error message
                let errorMessage = "Failed to fetch workouts. ";
                
                if (error.response) {
                    // Server responded with a status code outside of 2xx range
                    console.error(`Server error: ${error.response.status} - ${error.response.statusText}`);
                    console.error("Response data:", error.response.data);
                    
                    if (error.response.status === 401 || error.response.status === 403) {
                        errorMessage += "Authentication issue. Please log in again.";
                    } else if (error.response.status === 404) {
                        errorMessage += "Workout service not found. Please try again later.";
                    } else if (error.response.status >= 500) {
                        errorMessage += "Server error. Please try again later.";
                    }
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error("No response received from server:", error.request);
                    errorMessage += "No response from server. Please check your connection.";
                } else {
                    // Error in setting up the request
                    console.error("Request setup error:", error.message);
                    errorMessage += error.message;
                }
                
                // If in development mode, create mock data
                if (process.env.NODE_ENV === 'development') {
                    // console.warn("%c DEVELOPMENT MODE: Using mock data for development", "background: #f59e0b; color: black; padding: 2px 4px;");
                    // const mockWorkouts = [
                    //     {
                    //         id: 1,
                    //         name: "Push-Up Challenge",
                    //         description: "Complete 3 sets of push-ups with 30 seconds rest between sets. Focus on proper form with chest touching the ground and fully extended arms at the top.",
                    //         type: "Strength",
                    //         target: "Upper Body",
                    //         difficulty: "Medium"
                    //     },
                    //     {
                    //         id: 2,
                    //         name: "Mountain Climber HIIT",
                    //         description: "Perform mountain climbers for 45 seconds, followed by 15 seconds rest. Repeat for 5 rounds. Keep your core tight and maintain a steady pace.",
                    //         type: "Cardio",
                    //         target: "Full Body",
                    //         difficulty: "Hard"
                    //     },
                    //     {
                    //         id: 3,
                    //         name: "Plank Progression",
                    //         description: "Hold a plank position for 60 seconds. For beginners, drop to knees if needed. Advanced users can try side planks and plank shoulder taps.",
                    //         type: "Strength",
                    //         target: "Core",
                    //         difficulty: "Medium"
                    //     },
                    //     {
                    //         id: 4,
                    //         name: "Bodyweight Squat Routine",
                    //         description: "Complete 4 sets of 15 bodyweight squats. Focus on proper form with knees tracking over toes and weight in heels. Add jump squats for extra challenge.",
                    //         type: "Strength",
                    //         target: "Lower Body",
                    //         difficulty: "Easy"
                    //     },
                    //     {
                    //         id: 5,
                    //         name: "Burpee Blast",
                    //         description: "Complete as many burpees as possible in 2 minutes. Rest for 1 minute and repeat twice more. Focus on controlled movements and full extension.",
                    //         type: "Cardio",
                    //         target: "Full Body",
                    //         difficulty: "Hard"
                    //     },
                    //     {
                    //         id: 6,
                    //         name: "Yoga Flow Sequence",
                    //         description: "Follow a 10-minute sequence of sun salutations, warrior poses, and gentle stretches. Focus on breathing and maintaining proper alignment throughout.",
                    //         type: "Flexibility",
                    //         target: "Full Body",
                    //         difficulty: "Easy"
                    //     }
                    // ];
                    // setAllWorkouts(mockWorkouts);
                    // setError(null); // Clear error in dev mode
                } else {
                    setError(errorMessage);
                }
            }
        } catch (err) {
            // Handle network errors separately
            if (err.message === 'Network Error') {
                console.error("%c Network Error when fetching workouts", "color: #ef4444; font-weight: bold;");
                console.error("API might be unavailable or CORS issues");
            } else {
                console.error("%c API Error when fetching workouts:", "color: #ef4444; font-weight: bold;", {
                    message: err.message,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });
            }
            setError("Failed to fetch workouts. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserWorkouts = async (uid) => {
        try {
            console.log("%c Fetching user workouts for user ID:", "color: #0ea5e9; font-weight: bold;", uid);
            
            // In development mode, just use an empty set
            // if (process.env.NODE_ENV === 'development') {
            //     console.warn("%c DEVELOPMENT MODE: Using empty user workouts", "background: #f59e0b; color: black; padding: 2px 4px;");
            //     setUserWorkouts(new Set());
            //     return;
            // }
            
            // Get token for authorization
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            let response = null;
            let error = null;
            
            try {
                // Use the correct endpoint structure to match backend
                const fullUrl = `${apiBaseUrl}/api/user/${uid}/workout`;
                console.log(`%c Calling API endpoint: ${fullUrl}`, "background: #6366f1; color: white; padding: 2px 4px;");
                
                // Make API call with authentication directly with axios
                response = await axios.get(fullUrl, { headers });
            } catch (err) {
                console.error("%c API Error when fetching user workouts:", "background: #ef4444; color: white; padding: 2px 4px;", err);
                error = err;
            }
            
            if (response) {
                console.log("User workouts API response:", response);
                console.log("User workouts data:", response.data);
                
                // Handle different possible data structures
                let userWorkoutIds = [];
                if (response.data?.userWorkouts && Array.isArray(response.data.userWorkouts)) {
                    // Extract workoutId from each workout, handling different property names
                    userWorkoutIds = response.data.userWorkouts.map(w => 
                        w.workoutId || w.id || w._id || null
                    ).filter(id => id !== null);
                } else if (Array.isArray(response.data)) {
                    userWorkoutIds = response.data.map(w => 
                        w.workoutId || w.id || w._id || null
                    ).filter(id => id !== null);
                } else if (response.data?.data && Array.isArray(response.data.data)) {
                    userWorkoutIds = response.data.data.map(w => 
                        w.workoutId || w.id || w._id || null
                    ).filter(id => id !== null);
                }
                
                console.log("%c Extracted user workout IDs:", "color: #10b981;", userWorkoutIds);
                setUserWorkouts(new Set(userWorkoutIds));
            } else {
                console.warn("Could not fetch user workouts, using empty set");
                setUserWorkouts(new Set());
            }
            
        } catch (err) {
            // Handle network errors separately
            if (err.message === 'Network Error') {
                console.error("%c Network Error when fetching user workouts", "color: #ef4444; font-weight: bold;");
                console.error("API might be unavailable or CORS issues");
            } else {
                console.error("%c API Error when fetching user workouts:", "color: #ef4444; font-weight: bold;", {
                    message: err.message,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });
            }
        }
    };
    const handleToggle = async (workoutId, difficulty) => {
        const isSelected = userWorkouts.has(workoutId);
        // In development mode, just simulate the selection without API call
        // if (process.env.NODE_ENV === 'development') {
        //     console.log("%c DEVELOPMENT MODE: Simulating workout toggle", "background: #f59e0b; color: black; padding: 2px 4px;");
            
        //     // Add to loading set first
        //     setLoadingWorkouts(prev => new Set(prev).add(workoutId));
            
        //     // Simulate API delay
        //     setTimeout(() => {
        //         if (isSelected) {
        //             setUserWorkouts(prev => {
        //                 const next = new Set(prev);
        //                 next.delete(workoutId);
        //                 return next;
        //             });
        //         } else {
        //             setUserWorkouts(prev => {
        //                 const next = new Set(prev);
        //                 next.add(workoutId);
        //                 return next;
        //             });
        //         }
                
        //         // Remove from loading set after delay
        //         setLoadingWorkouts(prev => {
        //             const next = new Set(prev);
        //             next.delete(workoutId);
        //             return next;
        //         });
        //     }, 800);
            
        //     return;
        // }
        
        // For production, use the actual API with consistent endpoint structure
        // Use the consistent API endpoint structure for production
        const fullUrl = `${apiBaseUrl}/api/user/${user.id}/workout`;
        console.log(fullUrl);
        console.log("MMM");
        // Add to loading set
        setLoadingWorkouts(prev => new Set(prev).add(workoutId));

        try {
            // Get token for authorization
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            console.log(`%c API call to: ${fullUrl}`, "background: #6366f1; color: white; padding: 2px 4px;");
            
            if (isSelected) {
                // Use axios directly for consistency
                await axios.delete(fullUrl, { 
                    headers,
                    data: { workoutId }
                });
                
                setUserWorkouts(prev => {
                    const next = new Set(prev);
                    next.delete(workoutId);
                    return next;
                });
            } else {
                console.log("HII");
                // Use axios directly for consistency
                await axios.post(fullUrl, 
                    { workoutId, difficulty },
                    { headers }
                );
                
                setUserWorkouts(prev => {
                    const next = new Set(prev);
                    next.add(workoutId);
                    return next;
                });
            }
            
            // If there's a card element that needs an error class removed, 
            // we should use a proper reference to it
            // This part was causing issues - commented out for now
            // const card = document.querySelector(`[data-workout-id="${workoutId}"]`);
            // if (card) {
            //     setTimeout(() => card.classList.remove('workout-card-error'), 820);
            // }
        } catch (error) {
            console.error("Error toggling workout:", error);
            // If needed, you can add error handling UI feedback here
        } finally {
            // Remove from loading set
            setLoadingWorkouts(prev => {
                const next = new Set(prev);
                next.delete(workoutId);
                return next;
            });
        }
    };

    // Fallback UI if there's a render error
    if (renderError) {
        return (
            <div style={{ 
                padding: '20px', 
                margin: '20px', 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
            }}>
                <h2>Workout Page Error</h2>
                <p>{renderError}</p>
                <button 
                    onClick={() => window.location.href = '/login'}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(79, 70, 229, 0.6)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary
            fallback={(error, resetError) => {
                console.error("%c ErrorBoundary caught error:", "background: #ef4444; color: white; padding: 2px 4px;", error);
                return (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                        <h2>Something went wrong with the Workout page</h2>
                        <p>Error: {error?.message || "Unknown error"}</p>
                        <button 
                            onClick={resetError}
                            style={{ padding: '8px 16px', background: '#4f46e5', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', marginTop: '1rem' }}
                        >
                            Try Again
                        </button>
                    </div>
                );
            }}
        >
            <motion.div 
                className="workout-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
            {/* Animated background */}
            <div className="workout-background">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="workout-particle"
                        style={{
                            width: Math.random() * 5 + 1 + "px",
                            height: Math.random() * 5 + 1 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.3 + 0.1
                        }}
                        animate={{
                            y: [0, -(Math.random() * 200 + 100)],
                            opacity: [0.1, 0.3, 0]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
                
                <motion.div 
                    className="workout-orb workout-orb-blue"
                    animate={{
                        x: [0, 40, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="workout-orb workout-orb-purple"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="workout-orb workout-orb-green"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="workout-gradient-overlay"
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
                className="workout-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="workout-header-content">
                    <motion.h1 
                        className="workout-title"
                        initial={{ y: -30, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ 
                            delay: 0.2, 
                            duration: 0.7,
                            type: "spring",
                            stiffness: 100
                        }}
                        style={{
                            fontSize: "4.5rem",
                            color: "#ffffff",
                            fontWeight: 900,
                            textShadow: "0 0 50px rgba(79, 70, 229, 0.6), 0 0 100px rgba(79, 70, 229, 0.4)",
                            letterSpacing: "-0.03em",
                            marginBottom: "2rem",
                            lineHeight: "1.1"
                        }}
                    >
                        Workout Catalog
                    </motion.h1>
                    <motion.p
                        className="workout-subtitle"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Select your preferred workout routines to get started on your fitness journey
                    </motion.p>
                </div>
                <motion.div 
                    className="workout-header-decor"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="workout-header-circle"></div>
                    <div className="workout-header-line"></div>
                </motion.div>
            </motion.div>

            {error && (
                <motion.div 
                    className="workout-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {error}
                </motion.div>
            )}
            
            <motion.div 
                className="workout-cards-container"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
                <AnimatePresence>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <motion.div 
                                key={`loading-${index}`}
                                className="workout-loading-placeholder"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    delay: index * 0.1,
                                    duration: 0.5
                                }}
                            >
                                <div className="workout-loading-title"></div>
                                <div className="workout-loading-desc"></div>
                                <div className="workout-loading-meta"></div>
                            </motion.div>
                        ))
                    ) : (
                        allWorkouts.map((workout, index) => {
                            console.log(`%c Rendering workout ${index}:`, "color: #8b5cf6;", workout);
                            
                            // Handle different ID field names
                            const workoutId = workout.id || workout.workoutId || workout._id;
                            console.log(`Workout ID for ${workout.name || 'unnamed workout'}: ${workoutId}`);
                            
                            if (!workoutId) {
                                console.error("Workout missing ID:", workout);
                                return null; // Skip workouts without ID
                            }
                            
                            return (
                            <motion.div
                                key={workoutId}
                                data-workout-id={workoutId}
                                className={`workout-card ${userWorkouts.has(workoutId) ? 'selected' : ''}`}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0, 
                                    scale: 1,
                                    background: userWorkouts.has(workoutId)
                                        ? "rgba(79, 70, 229, 0.01)"
                                        : "rgba(255, 255, 255, 0.01)",
                                    backdropFilter: "blur(25px)",
                                    boxShadow: userWorkouts.has(workoutId)
                                        ? "0 8px 32px rgba(79, 70, 229, 0.08), 0 4px 8px rgba(0, 0, 0, 0.1)"
                                        : "0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.1)"
                                }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    duration: 0.7,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    y: -10,
                                    scale: 1.02,
                                    background: userWorkouts.has(workoutId)
                                        ? "rgba(79, 70, 229, 0.015)"
                                        : "rgba(255, 255, 255, 0.015)",
                                    boxShadow: userWorkouts.has(workoutId)
                                        ? "0 20px 40px rgba(79, 70, 229, 0.12), 0 8px 16px rgba(0, 0, 0, 0.12)"
                                        : "0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.12)",
                                    backdropFilter: "blur(30px)",
                                    transition: {
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }
                                }}
                            >
                                <div className="workout-card-shine"></div>
                                <div className="workout-card-header">
                                    <h2 className="workout-card-title">{workout.name || "Unnamed Workout"}</h2>
                                    <div className="workout-checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            id={`workout-${workoutId}`}
                                            className={`workout-checkbox ${loadingWorkouts.has(workoutId) ? 'workout-checkbox-loading' : ''}`}
                                            checked={userWorkouts.has(workoutId)}
                                            onChange={() => handleToggle(workoutId, workout.difficulty)}
                                            disabled={loadingWorkouts.has(workoutId)}
                                        />
                                        <label htmlFor={`workout-${workoutId}`} className="workout-checkbox-label">
                                            <span className="checkbox-icon"></span>
                                            <span className="checkbox-text">
                                                {userWorkouts.has(workoutId) ? 'Selected' : 'Select'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="workout-card-body">
                                    <p className="workout-description" style={{ 
                                        color: "#ffffff",
                                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)", // Stronger shadow for better contrast
                                        opacity: 1,
                                        fontWeight: 500,
                                        letterSpacing: "0.01em",
                                        lineHeight: "1.6", // Reduced line height for more compact display
                                        filter: "brightness(1.4)", // Increased brightness for whiter appearance
                                        background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent)", // Subtle gradient background
                                        padding: "0.75rem 1.5rem", // Added horizontal padding
                                        textRendering: "optimizeLegibility",
                                        mixBlendMode: "normal", // Ensure text blends properly
                                        margin: "0.75rem 0 2rem", // Increased margins for better spacing
                                        textAlign: "left" // Ensure left alignment
                                    }}>{workout.description || "No description available"}</p>
                                    <div className="workout-card-footer">
                                        <div className="workout-meta">
                                            <div className="workout-meta-item">
                                                <span className="workout-meta-label">Type</span>
                                                <span className="workout-meta-value">{workout.type || "General"}</span>
                                            </div>
                                            <div className="workout-meta-item">
                                                <span className="workout-meta-label">Target</span>
                                                <span className="workout-meta-value">{workout.target || "Full body"}</span>
                                            </div>
                                        </div>
                                        <div className={`workout-difficulty workout-difficulty-${(workout.difficulty || 'medium').toLowerCase()}`}>
                                            {workout.difficulty || "Medium"}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>
            </motion.div>
        </ErrorBoundary>
    );
}

export default Workout;

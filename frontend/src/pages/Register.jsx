import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// Note: The following imports require these packages to be installed:
// npm install framer-motion lucide-react
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, Calendar, User, Ruler, Weight, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";

import '../styles/Register.css';
import {AuthData} from "../auth/AuthWrapper.jsx";

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        height: '',
        weight: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        age: false,
        gender: false,
        height: false,
        weight: false
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        // Mark field as touched when user types
        if (!touched[name]) {
            setTouched(prev => ({
                ...prev,
                [name]: true
            }));
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched for validation
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            age: true,
            gender: true,
            height: true,
            weight: true
        });
        
        // Basic validation
        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            // Format the user data according to your backend model
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                age: parseInt(formData.age, 10),
                gender: formData.gender,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                workouts: [],
                habits: []
            };

            const response = await axios.post('http://localhost:8080/api/user/register', userData);

            if (response.status === 200) {
                // Registration successful
                setRegistrationSuccess(true);
                
                // Delay navigation to show success message
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="register-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated background */}
            <div className="register-background">
                {/* Particle effects */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="register-particle"
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
                    className="register-orb register-orb-blue"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 20, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div 
                    className="register-orb register-orb-purple"
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
                    className="register-gradient-overlay"
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

                <div className="register-form-wrapper">
                    <div className="text-center">
                        <div className="register-avatar">
                            <UserPlus size={40} className="register-avatar-icon" />
                        </div>
                        <h2 className="register-title" style={{ color: 'white' }}>Welcome to Trekon 💪</h2>
                        <p className="register-subtitle">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form" style={{ maxWidth: '24rem', margin: '0 auto' }}>
                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <User size={18} />
                            </div>
                            <motion.input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder=" "
                                required
                                className={`form-control ${touched.firstName && formData.firstName.length < 1 ? 'input-error' : ''} 
                                    ${touched.firstName && formData.firstName.length > 0 ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                            />
                            <label htmlFor="firstName" className="input-label">First Name</label>
                            <div className="input-border input-border-blue" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <User size={18} />
                            </div>
                            <motion.input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder=" "
                                required
                                className={`form-control ${touched.lastName && formData.lastName.length < 1 ? 'input-error' : ''} 
                                    ${touched.lastName && formData.lastName.length > 0 ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                            />
                            <label htmlFor="lastName" className="input-label">Last Name</label>
                            <div className="input-border input-border-blue" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <Mail size={18} />
                            </div>
                            <motion.input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder=" "
                                required
                                className={`form-control ${touched.email && !validateEmail(formData.email) ? 'input-error' : ''} 
                                    ${touched.email && validateEmail(formData.email) ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                            />
                            <label htmlFor="email" className="input-label">Email Address</label>
                            <div className="input-border input-border-blue" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <Lock size={18} />
                            </div>
                            <motion.input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder=" "
                                required
                                className={`form-control ${touched.password && formData.password.length < 6 ? 'input-error' : ''} 
                                    ${touched.password && formData.password.length >= 6 ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="visibility-toggle"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <motion.div
                                    whileHover={{ 
                                        scale: 1.1, 
                                        rotate: 10,
                                        color: showPassword ? "#f8a4ff" : "#a4c8f8"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} aria-label="Hide password" />
                                    ) : (
                                        <Eye size={18} aria-label="Show password" />
                                    )}
                                </motion.div>
                            </button>
                            <label htmlFor="password" className="input-label">Password</label>
                            <div className="input-border input-border-purple" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <Calendar size={18} />
                            </div>
                            <motion.input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder=" "
                                required
                                min="1"
                                max="120"
                                className={`form-control ${touched.age && formData.age.length < 1 ? 'input-error' : ''} 
                                    ${touched.age && formData.age.length > 0 ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, age: true }))}
                            />
                            <label htmlFor="age" className="input-label">Age</label>
                            <div className="input-border input-border-blue" />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-icon">
                                <User size={18} />
                            </div>
                            <motion.select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className={`form-control ${touched.gender && formData.gender.length < 1 ? 'input-error' : ''} 
                                    ${touched.gender && formData.gender.length > 0 ? 'input-valid' : ''}`}
                                onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                            >
                                <option value="" disabled></option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-Binary</option>
                                <option value="other">Other</option>
                            </motion.select>
                            <label htmlFor="gender" className="input-label">Gender</label>
                            <div className="input-border input-border-purple" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="half">
                            <div className="input-group">
                                <div className="input-icon">
                                    <Ruler size={18} />
                                </div>
                                <motion.input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    min="0"
                                    step="0.01"
                                    className={`form-control ${touched.height && formData.height.length < 1 ? 'input-error' : ''} 
                                        ${touched.height && formData.height.length > 0 ? 'input-valid' : ''}`}
                                    onBlur={() => setTouched(prev => ({ ...prev, height: true }))}
                                />
                                <span className="input-group-text">ft</span>
                                <label htmlFor="height" className="input-label">Height</label>
                                <div className="input-border input-border-blue" />
                            </div>
                        </div>

                        <div className="half">
                            <div className="input-group">
                                <div className="input-icon">
                                    <Weight size={18} />
                                </div>
                                <motion.input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    min="0"
                                    step="0.1"
                                    className={`form-control ${touched.weight && formData.weight.length < 1 ? 'input-error' : ''} 
                                        ${touched.weight && formData.weight.length > 0 ? 'input-valid' : ''}`}
                                    onBlur={() => setTouched(prev => ({ ...prev, weight: true }))}
                                />
                                <span className="input-group-text">kg</span>
                                <label htmlFor="weight" className="input-label">Weight</label>
                                <div className="input-border input-border-purple" />
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="error-message"
                                initial={{ opacity: 0, y: -10, x: 10 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15
                                }}
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success message */}
                    <AnimatePresence>
                        {registrationSuccess && (
                            <motion.div 
                                className="error-message"
                                style={{ 
                                    backgroundColor: "rgba(34, 197, 94, 0.1)", 
                                    borderColor: "rgba(34, 197, 94, 0.2)",
                                    color: "#86efac" 
                                }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <CheckCircle size={18} />
                                <span>Registration successful! Redirecting to login...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <motion.button
                        type="submit"
                        className="register-button"
                        whileHover={{ 
                            translateY: -1,
                            backgroundColor: "#4338ca"
                        }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || registrationSuccess}
                        style={{ borderRadius: '0.125rem' }}
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    className="button-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.svg 
                                        className="spinner" 
                                        style={{ marginRight: "0.5rem", width: "1.25rem", height: "1.25rem" }}
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
                                    <span>Creating account...</span>
                                </motion.div>
                            ) : registrationSuccess ? (
                                <motion.div
                                    key="success"
                                    className="button-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <CheckCircle size={18} style={{ marginRight: "0.5rem" }} />
                                    <span>Success!</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    className="button-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span>Create Account</span>
                                    <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    
                    <div className="flex items-center justify-center mt-4">
                        <div className="text-sm text-white/70">
                            Already have an account?{" "}
                            <span className="inline-block">
                                <Link
                                    to="/login" 
                                    className="login-link"
                                >
                                    Log in
                                </Link>
                            </span>
                        </div>
                    </div>
                    </form>
                </div>
        </motion.div>
    );
}

export default Register;

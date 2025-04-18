import React, {useEffect, useState} from "react";
import { AuthData } from "../auth/AuthWrapper.jsx";
import {useNavigate, Link} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import "../styles/Login.css";

function Login() {
    const { login, user } = AuthData();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAuthenticated) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Mark field as touched when user types
        if (!touched[name]) {
            setTouched(prev => ({ ...prev, [name]: true }));
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    async function doLogin(e) {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({ email: true, password: true });
        
        // Validate inputs
        if (!validateEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        if (formData.password.length < 1) {
            setErrorMessage("Please enter your password");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            await login(formData.email, formData.password);
            setErrorMessage(""); // Clear error if successful
            setLoginSuccess(true);
            
            // Delay navigation slightly to show success state
            setTimeout(() => {
                navigate("/");
            }, 800);
            
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(error?.response?.data?.message || "Invalid email or password. Please try again.");
            setLoginSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div 
            className="login-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated background */}
            <div className="login-background">
                {/* Particle effects */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="login-particle"
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
                    className="login-orb login-orb-blue"
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
                    className="login-orb login-orb-purple"
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
                    className="login-gradient-overlay"
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
            <div className="login-card">
                <div className="text-center">
                    <div className="login-avatar">
                        <User size={68} className="login-avatar-icon" />
                    </div>
                    <h2 className="login-title">
                        Welcome Back
                    </h2>
                    <p className="login-subtitle">
                        Sign in to continue to your account
                    </p>
                </div>

                <form 
                    className="login-form"
                    onSubmit={doLogin}
                >
                    <div className="space-y-6">
                        <div>
                            <div className="login-input-container">
                                <div className="login-input-icon">
                                    <User size={18} />
                                </div>
                                <motion.input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder=" "
                                    onChange={handleChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                    value={formData.email}
                                    transition={{
                                        layout: { duration: 0.3, type: "spring" }
                                    }}
                                    className={`login-input ${touched.email && !validateEmail(formData.email) ? 'login-input-error' : ''} 
                                        ${touched.email && validateEmail(formData.email) ? 'login-input-valid' : ''}`}
                                />
                                
                                {/* Validation indicator */}
                                {touched.email && (
                                    <div className="login-validation-icon">
                                        <AnimatePresence mode="wait">
                                            {validateEmail(formData.email) ? (
                                                <motion.div
                                                    key="valid"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <CheckCircle size={16} className="text-green-400" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="invalid"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <XCircle size={16} className="text-red-400" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                                <label 
                                    htmlFor="email" 
                                    className="login-label"
                                >
                                    Email Address
                                </label>
                                
                                {/* Bottom border animation */}
                                <div className="login-input-border login-input-border-email" />
                            </div>
                        </div>
                        
                        <div>
                            <div className="login-input-container">
                                <div className="login-input-icon">
                                    <Lock size={18} />
                                </div>
                                {/* Password Input with toggle type */}
                                <motion.input
                                    layout
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder=" "
                                    onChange={handleChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                    value={formData.password}
                                    className={`login-input ${showPassword ? 'login-input-text' : 'login-input-password'} ${touched.password && formData.password.length < 1 ? 'login-input-error' : ''} 
                                        ${touched.password && formData.password.length > 0 ? 'login-input-valid' : ''}`}
                                />
                                
                                {/* Password visibility toggle button */}
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="login-visibility-toggle"
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
                                
                                <label 
                                    htmlFor="password" 
                                    className="login-label"
                                >
                                    Password
                                </label>
                                
                                {/* Bottom border animation */}
                                <div className="login-input-border login-input-border-password" />
                            </div>
                        </div>
                    </div>

                    {/* Password strength indicator removed for login form */}
                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div 
                                className="login-message login-message-error"
                                initial={{ opacity: 0, y: -10, x: 10 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15
                                }}
                            >
                                {/* Animated background pulse for error message */}
                                <motion.div 
                                    className="login-message-pulse"
                                    animate={{ 
                                        opacity: [0.1, 0.2, 0.1] 
                                    }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity,
                                        repeatType: "mirror" 
                                    }}
                                />
                                <motion.div
                                    className="login-message-icon"
                                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <AlertCircle size={20} className="text-red-400" />
                                </motion.div>
                                <p className="login-message-text login-error-text">{errorMessage}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Success animation */}
                    <AnimatePresence>
                        {loginSuccess && (
                            <motion.div 
                                className="login-message login-message-success"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <motion.div
                                    className="login-message-icon"
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircle size={20} className="text-green-400" />
                                </motion.div>
                                <p className="login-message-text login-success-text">Login successful! Redirecting...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <motion.button
                            type="submit"
                            className="login-button"
                            whileHover={{ 
                                translateY: -1,
                                backgroundColor: "#4338ca"
                            }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading || loginSuccess}
                        >
                            {/* Loading spinner with better animation */}
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        className="login-button-content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <motion.svg 
                                            className="-ml-1 mr-2 h-5 w-5 text-white" 
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
                                        <span>Signing in...</span>
                                    </motion.div>
                                ) : loginSuccess ? (
                                    <motion.div 
                                        key="success"
                                        className="login-button-content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <CheckCircle size={18} className="mr-2" />
                                        </motion.div>
                                        <span>Success!</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        className="login-button-content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <LogIn size={18} className="mr-2" />
                                        <span>Sign in</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        <div className="text-sm text-white/70">
                            Don't have an account?{" "}
                            <span className="inline-block">
                                <Link
                                    to="/register" 
                                    className="login-register-link"
                                >
                                    Register
                                </Link>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default Login;

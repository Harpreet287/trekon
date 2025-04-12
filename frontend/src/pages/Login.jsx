import React, {useEffect, useState} from "react";
import { AuthData } from "../auth/AuthWrapper.jsx";
import {useNavigate} from "react-router-dom";

function Login() {
    const { login, user } = AuthData();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAuthenticated) {
            navigate("/");
        }
    }, [user, navigate]);
    console.log("HIIII");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function doLogin() {
        try {
            await login(formData.email, formData.password);
            console.log("Login success");
            setErrorMessage(""); // Clear error if successful

        } catch (error) {
            console.error("Login failed in doLogin():", error);
            setErrorMessage("Login failed: " + (error?.response?.data?.message || error.message));

            setErrorMessage("Login failed");
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
            />
            <button onClick={doLogin}>Login</button>

            {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
    );
}

export default Login;

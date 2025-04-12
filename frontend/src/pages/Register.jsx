import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/register.css'
function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName:'',
        email: '',
        password: '',
        age: '',
        gender: '',
        height: '',
        weight: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                // Registration successful, redirect to login
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h1 className="register-title">Welcome to Trekon 💪</h1>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First name"
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e-mail"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="pass"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="age"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="gender"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <div className="input-group">
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="height"
                                    required
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                />
                                <span className="input-group-text">ft</span>
                            </div>
                        </div>

                        <div className="form-group half">
                            <div className="input-group">
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="weight"
                                    required
                                    className="form-control"
                                    min="0"
                                    step="0.1"
                                />
                                <span className="input-group-text">kg</span>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Let's Get Started"}
                            <span className="arrow-icon">-></span>
                            </button>
                            </form>
                            </div>
                            </div>
                            );
                        }

export default Register;
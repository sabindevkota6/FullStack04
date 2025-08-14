import { useState, type ChangeEvent, type FormEvent } from "react";
import './register.css';
import { register } from '../../shared/config/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({username: '', password: '', email: ''});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (loading) {
            return;
        }
        
        setLoading(true);
        register(formData).then((res) => {
            toast.success("Registration successful! Please login.");
            navigate("/login");
        })
        .catch((error) => {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="register-container">
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit} className="register-form">
                <label className="label-tag">
                    Username:
                    <span style={{ display: "inline-block", width: "16px" }}></span>
                    <input 
                        className="input-tag" 
                        onChange={handleChange} 
                        type="text" 
                        value={formData.username} 
                        name="username" 
                        required 
                    />
                </label>
                <br />
                <label className="label-tag">
                    Email:
                    <span style={{ display: "inline-block", width: "42px" }}></span>
                    <input 
                        className="input-tag" 
                        onChange={handleChange} 
                        type="email" 
                        value={formData.email} 
                        name="email" 
                        required 
                    />
                </label>
                <br />
                <label className="label-tag">
                    Password:
                    <span style={{ display: "inline-block", width: "16px" }}></span>
                    <input 
                        className="input-tag" 
                        onChange={handleChange} 
                        type="password" 
                        value={formData.password} 
                        name="password" 
                        required 
                    />
                </label>
                <br />
                <button 
                    className="submit-button" 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="login-link">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default Register;
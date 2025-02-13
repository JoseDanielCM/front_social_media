import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../Util/ThemeContext'
import BtnTheme from '../Components/BtnTheme'

// Elimina la cookie especificando el nombre

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cookies = document.cookie.split(";");
        console.log(cookies);
        cookies.forEach(cookie => {
          const cookieName = cookie.split("=")[0].trim();
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        try {
            const response = await axios.post(
                "http://localhost:1234/auth/login", // Authentication endpoint
                credentials, // Request body with user credentials
                { headers: { "Content-Type": "application/json" },
                withCredentials: true // Habilita el uso de cookies
            } // Set header for JSON
            );
            navigate("/home")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "An unexpected error occurred");
            } else {
                alert("An unexpected error occurred");
            }
        }
    };

    return (
        <div className={`flex min-h-screen items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
            <BtnTheme />
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`}
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">
                    Don't have an account?  
                    <Link to="/register" className="text-indigo-400 hover:underline ml-1">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>

    );
};

export default Login;

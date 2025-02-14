import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../Util/ThemeContext'
import BtnTheme from '../Components/BtnTheme'

const Register = () => {
    const [user, setUser] = useState({ username: "", password: "", first_name: "", last_name: "", email: "", birthdate: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cookies = document.cookie.split(";");
        console.log(cookies);
        cookies.forEach(cookie => {
          const cookieName = cookie.split("=")[0].trim();
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        const age = calculateAge(user.birthdate);
        if (age < 0) {
            setError("Birthdate cannot be in the future.");
            return;
        }
        if (age < 14) {
            setError("You must be at least 14 years old to register.");
            return;
        }

        setError("");

        try {
            const response = await axios.post(
                "http://localhost:1234/auth/register",
                user,
                { headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
            );
            if (response.status !== 200) throw new Error("Registration failed");
            navigate("/home")
        } catch (errorCatch) {
            console.log(errorCatch);
            if (axios.isAxiosError(errorCatch)) {
                setError(errorCatch.response?.data?.message || "An unexpected error occurred");
            } else {
                alert("An unexpected error occurred");
            }
        }
    };

    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        if (birthDate > today) return -1; // Invalid future date
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
            <BtnTheme />
            <div className={`p-8 rounded-2xl shadow-md w-96 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="username" placeholder="Username" value={user.username} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <input type="text" name="first_name" placeholder="First name" value={user.first_name} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <input type="text" name="last_name" placeholder="Last name" value={user.last_name} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <input type="date" name="birthdate" value={user.birthdate} onChange={handleChange} required
                        className={`w-full p-2 border rounded transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-indigo-400' : 'border-gray-300 bg-white text-black focus:ring-indigo-500'}`} />
                    <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition">Register</button>
                </form>
                <p className={`text-center mt-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Already have an account?
                    <Link to="/login" className="text-purple-400 hover:underline"> Log in</Link>
                </p>
            </div>
        </div>

    );
};

export default Register;

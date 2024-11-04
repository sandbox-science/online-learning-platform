import React, { useState } from "react";
import Cookies from 'js-cookie'
import Notiflix from 'notiflix';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate                = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Login successful!");
                Cookies.set('token', data.token, { expires: 1, sameSite: 'none', secure: true });
                Cookies.set('userId', data.user.ID, { sameSite: 'none', secure: true });
                setTimeout(() => {
                    navigate('/courses', { replace: true });
                    window.location.reload();
                }, 1000);
            } else {
                Notiflix.Notify.failure(data.message || "Login failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during login");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            className="mt-2 text-sm text-blue-500"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

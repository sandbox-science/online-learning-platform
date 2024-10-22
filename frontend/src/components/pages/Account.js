import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';

export function Account() {
    const [userInfo, setUserInfo]         = useState(null);
    const [error, setError]               = useState(null);
    const [formData, setFormData]         = useState({ password: "" });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        fetch(`http://localhost:4000/user/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setUserInfo(data.user))
            .catch((error) => setError(error.message));
    }, []);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = Cookies.get('userId');

        try {
            const response = await fetch("http://localhost:4000/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Account Deleted successfully!");
                Cookies.remove('token');
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                Notiflix.Notify.failure(data.message);
            }
        } catch {
            Notiflix.Notify.failure("Error occurred during deletion");
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!userInfo) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <h1 className="text-2xl font-bold mb-4">Account Information</h1>
                <p><b>Email</b>: {userInfo.email}</p>
                <p><b>Username</b>: {userInfo.username}</p>

                <h2 className="pt-5 text-2xl font-bold mb-4">Delete Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <br/>

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
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}

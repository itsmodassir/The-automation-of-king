"use client";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
            const loginUrl = `${apiUrl}/admin/auth/login`;
            console.log('Attempting login to:', loginUrl);

            const res = await fetch(loginUrl, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            console.log('Response status:', res.status, res.statusText);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                console.error('Login error:', errorData);
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();
            console.log('Login successful, token received');
            document.cookie = `admin_token=${data.access_token}; path=/`;
            localStorage.setItem('admin_token', data.access_token);
            window.location.href = "/dashboard";
        } catch (err) {
            console.error('Login exception:', err);
            alert(`Invalid credentials or API error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white border p-8 rounded-xl shadow-sm w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
                <div className="space-y-4">
                    <input
                        className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={login}
                        className="bg-black text-white w-full py-2 rounded font-medium hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

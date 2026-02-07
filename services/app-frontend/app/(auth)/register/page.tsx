"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
    const [workspaceName, setWorkspaceName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { access_token } = await api("/auth/register", {
                method: "POST",
                body: { workspaceName, email, password },
            });
            document.cookie = `auth_token=${access_token}; path=/; max-age=604800`;
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-3xl font-black tracking-tighter mb-2">Create your account</h1>
                <p className="text-gray-500 mb-8 font-medium">Get started with Aerostic.</p>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Work Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Workspace Name</label>
                        <input
                            type="text"
                            value={workspaceName}
                            onChange={e => setWorkspaceName(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                            placeholder="My Company"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <div className="text-center mt-6">
                        <a href="/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                            Already have an account? <span className="underline">Sign in</span>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

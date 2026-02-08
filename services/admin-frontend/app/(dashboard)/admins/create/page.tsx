"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function CreateAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "onboarding_admin"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api("/admin/auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            router.push("/dashboard/admins");
        } catch (error) {
            alert("Failed to create admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Onboard New Team Member</h2>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="onboarding_admin">Onboarding Admin (Can add tenants)</option>
                        <option value="support_admin">Support Admin (Read-only access)</option>
                        <option value="platform_admin">Platform Admin (Revenue & Analytics)</option>
                        <option value="super_admin">Super Admin (Full Access)</option>
                    </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                    <a href="/dashboard/admins" className="text-sm font-medium text-gray-500 hover:text-black">
                        Cancel
                    </a>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Create Member
                    </button>
                </div>
            </form>
        </div>
    );
}

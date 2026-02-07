"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateTenant() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function create() {
        setLoading(true);
        setError("");
        try {
            const token = getToken();
            if (!token) throw new Error("Not authenticated");

            await api("/admin/tenants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, domain, aiEnabled: true }),
            });
            router.push("/dashboard/tenants");
        } catch (err: any) {
            setError(err.message || "Failed to create tenant");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Create Tenant</h2>
                <a href="/dashboard/tenants" className="text-sm text-gray-500 hover:text-black">Cancel</a>
            </div>

            <div className="bg-white border p-8 rounded-2xl shadow-sm space-y-6">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}

                <div>
                    <label className="block text-sm font-medium mb-2">Tenant Name</label>
                    <input
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Acme Corp"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Domain (Subdomain)</label>
                    <div className="flex items-center">
                        <input
                            className="w-full border p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="acme"
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                        />
                        <span className="bg-gray-100 border border-l-0 p-3 rounded-r-lg text-gray-500">.aerostic.com</span>
                    </div>
                </div>

                <button
                    onClick={create}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Tenant"}
                </button>
            </div>
        </div>
    );
}

function getToken() {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("admin_token="))
        ?.split("=")[1];
}

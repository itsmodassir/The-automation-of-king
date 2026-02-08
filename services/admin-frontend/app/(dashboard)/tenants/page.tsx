"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("/admin/tenants").then(setTenants).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading tenants...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tenants</h2>
                <div className="flex items-center gap-4">
                    <a href="/dashboard" className="text-sm text-gray-500 hover:text-black">← Dashboard</a>
                    <a href="/dashboard/tenants/create" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        + Create Tenant
                    </a>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left border-b">
                            <th className="p-4 font-semibold text-sm">Tenant</th>
                            <th className="p-4 font-semibold text-sm">Onboarding</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((t: any) => (
                            <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.domain}.aerostic.com</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded w-fit capitalize">
                                            {t.onboardingStatus?.replace(/_/g, ' ') || 'Created'}
                                        </span>
                                        {t.onboardedBy && (
                                            <span className="text-[10px] text-gray-400">
                                                By: {t.onboardedBy.substring(0, 8)}...
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-right">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

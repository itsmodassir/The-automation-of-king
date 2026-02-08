"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Gauge, TrendingUp, AlertTriangle } from "lucide-react";

export default function Quotas() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = () => {
        api("/admin/tenants")
            .then(setTenants)
            .catch(() => setTenants([]))
            .finally(() => setLoading(false));
    };

    const getUsagePercentage = (used: number, limit: number) => {
        if (!limit) return 0;
        return Math.min(Math.round((used / limit) * 100), 100);
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-600 bg-red-100';
        if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    if (loading) return <div className="p-8">Loading quotas...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Quotas & Usage</h2>
                    <p className="text-gray-500 text-sm mt-1">Monitor and enforce billing limits across tenants.</p>
                </div>
                <button onClick={fetchTenants} className="text-sm text-gray-500 hover:text-black">
                    Refresh
                </button>
            </div>

            <div className="grid gap-6">
                {tenants.map((tenant: any) => {
                    // Mock usage data - in production this would come from actual usage metrics
                    const messageUsage = Math.floor(Math.random() * 1000);
                    const messageLimit = 1000;
                    const aiUsage = Math.floor(Math.random() * 500);
                    const aiLimit = 500;

                    const messagePercentage = getUsagePercentage(messageUsage, messageLimit);
                    const aiPercentage = getUsagePercentage(aiUsage, aiLimit);

                    return (
                        <div key={tenant.id} className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">{tenant.name}</h4>
                                    <p className="text-xs text-gray-500">{tenant.domain}.aerostic.com</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {tenant.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Messages Quota */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Messages</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getUsageColor(messagePercentage)}`}>
                                            {messagePercentage}%
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-2xl font-bold">{messageUsage.toLocaleString()}</span>
                                        <span className="text-sm text-gray-500">/ {messageLimit.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${messagePercentage >= 90 ? 'bg-red-500' :
                                                    messagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${messagePercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* AI Credits Quota */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">AI Credits</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getUsageColor(aiPercentage)}`}>
                                            {aiPercentage}%
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-2xl font-bold">{aiUsage.toLocaleString()}</span>
                                        <span className="text-sm text-gray-500">/ {aiLimit.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${aiPercentage >= 90 ? 'bg-red-500' :
                                                    aiPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${aiPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {(messagePercentage >= 90 || aiPercentage >= 90) && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                    <AlertTriangle className="text-red-600 mt-0.5" size={16} />
                                    <p className="text-xs text-red-700">
                                        <strong>Warning:</strong> This tenant is approaching or has exceeded quota limits.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {tenants.length === 0 && (
                <div className="bg-white p-12 rounded-xl border text-center text-gray-500">
                    <Gauge className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>No tenants found.</p>
                </div>
            )}
        </div>
    );
}

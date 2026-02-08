"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TrendingUp, MessageSquare, Users, Clock } from "lucide-react";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await api("/api/analytics/overview");
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            setAnalytics({
                messages: 0,
                conversations: 0,
                contacts: 0,
                avgResponseTime: "0m",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading analytics...</div>;
    }

    const metrics = [
        {
            name: "Total Messages",
            value: analytics.messages || 0,
            change: "+12%",
            icon: MessageSquare,
            color: "bg-blue-500",
        },
        {
            name: "Active Conversations",
            value: analytics.conversations || 0,
            change: "+8%",
            icon: Users,
            color: "bg-green-500",
        },
        {
            name: "Total Contacts",
            value: analytics.contacts || 0,
            change: "+15%",
            icon: TrendingUp,
            color: "bg-purple-500",
        },
        {
            name: "Avg Response Time",
            value: analytics.avgResponseTime || "0m",
            change: "-5%",
            icon: Clock,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-2">Track your WhatsApp business performance and insights.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric) => (
                    <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${metric.color} p-3 rounded-lg`}>
                                <metric.icon className="text-white" size={24} />
                            </div>
                            <span className={`text-sm font-semibold ${metric.change.startsWith("+") ? "text-green-600" : "text-red-600"
                                }`}>
                                {metric.change}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{metric.name}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Volume</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p>Chart visualization coming soon</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p>Chart visualization coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

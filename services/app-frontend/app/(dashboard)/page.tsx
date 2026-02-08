"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TrendingUp, MessageSquare, Users, MessageCircle } from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await api("/api/analytics/overview");
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            // Set mock data if API fails
            setStats({
                messages: 0,
                conversations: 0,
                contacts: 0,
                whatsappConnected: false,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    const statCards = [
        {
            name: "Messages Sent",
            value: stats?.messages || 0,
            icon: MessageSquare,
            color: "bg-blue-500",
        },
        {
            name: "Active Conversations",
            value: stats?.conversations || 0,
            icon: MessageCircle,
            color: "bg-green-500",
        },
        {
            name: "Total Contacts",
            value: stats?.contacts || 0,
            icon: Users,
            color: "bg-purple-500",
        },
        {
            name: "Growth Rate",
            value: "+12%",
            icon: TrendingUp,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your WhatsApp business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* WhatsApp Connection Status */}
            {!stats?.whatsappConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Connect Your WhatsApp Account</h3>
                    <p className="text-yellow-700 mb-4">
                        Get started by connecting your WhatsApp Business account to start sending messages.
                    </p>
                    <a
                        href="/dashboard/whatsapp"
                        className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
                    >
                        Connect WhatsApp
                    </a>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>No recent activity yet. Start by connecting your WhatsApp account!</p>
                </div>
            </div>
        </div>
    );
}

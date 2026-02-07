"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Phone, MessageSquare, Zap, Users } from "lucide-react";

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/analytics/overview", { token }).then(setStats).finally(() => setLoading(false));
        }
    }, []);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-5xl font-black tracking-tighter">Overview</h1>
                <p className="text-gray-500 font-medium mt-2 text-lg">Your workspace activity at a glance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Number" value={stats?.whatsappNumber || '...'} icon={Phone} />
                <StatCard title="Messages" value={stats?.messagesSent || 0} icon={MessageSquare} />
                <StatCard title="AI Credits" value={stats?.aiCreditsUsed || 0} icon={Zap} />
                <StatCard title="Open Chats" value={stats?.openConversations || 0} icon={Users} />
            </div>

            <div className="bg-white border rounded-3xl p-10 shadow-sm">
                <h3 className="text-2xl font-black mb-6">Growth Graph</h3>
                <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 italic">
                    Fetching real-time trends...
                </div>
            </div>
        </div>
    );
}

import { LucideIcon } from "lucide-react";

function StatCard({ title, value, icon: Icon, loading }: { title: string, value: string | number, icon?: LucideIcon, loading?: boolean }) {
    return (
        <div className="bg-white border text-card-foreground shadow-sm p-6 rounded-xl flex flex-col justify-between space-y-2">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-muted-foreground tracking-tight text-gray-500 uppercase">{title}</span>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight">{loading ? "..." : value}</div>
        </div>
    );
}

function getToken() {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1];
}

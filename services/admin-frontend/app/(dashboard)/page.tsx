"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { OverviewChart } from "@/components/overview-chart";
import Link from 'next/link';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("/admin/analytics/overview")
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    const chartData = stats ? [
        { name: 'Revenue', value: stats.revenue || 0 },
        { name: 'Tenants', value: stats.tenants },
        { name: 'Messages', value: stats.messages },
        { name: 'AI Credits', value: stats.ai },
        { name: 'WA Accounts', value: stats.wa },
    ] : [];

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight">Control Tower</h1>
                <p className="text-gray-500 mt-2 font-medium">
                    Platform-grade overview of Aerostic infrastructure and growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
                <StatCard title="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} loading={loading} />
                <StatCard title="Total Tenants" value={stats?.tenants || 0} loading={loading} />
                <StatCard title="Messages Sent" value={stats?.messages || 0} loading={loading} />
                <StatCard title="AI Usage" value={stats?.ai || 0} loading={loading} />
                <StatCard title="Connected WA" value={stats?.wa || 0} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 border p-8 rounded-2xl bg-white shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Platform Activity</h3>
                    {!loading ? <OverviewChart data={chartData} /> : <div className="h-[300px] flex items-center justify-center text-gray-400">Loading graph...</div>}
                </div>

                <div className="space-y-4">
                    <NavCard href="/dashboard/tenants" title="Tenants" desc="Suspend, activate, and manage." />
                    <NavCard href="/dashboard/meta" title="Meta Tokens" desc="System user rotation." />
                    <NavCard href="/dashboard/logs" title="Audit Logs" desc="Track every action." />
                    <NavCard href="/dashboard/usage" title="Quotas" desc="Enforce billing limits." />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, loading }: any) {
    return (
        <div className="border p-6 rounded-2xl bg-white shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
            <h4 className="text-3xl font-black mt-2">{loading ? "..." : value}</h4>
        </div>
    );
}

function NavCard({ href, title, desc }: any) {
    return (
        <a href={href} className="block border p-5 rounded-2xl hover:bg-black hover:text-white transition-all group shadow-sm bg-white">
            <h4 className="font-bold text-lg">{title}</h4>
            <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-300">{desc}</p>
        </a>
    );
}

function getToken() {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("admin_token="))
        ?.split("=")[1];
}

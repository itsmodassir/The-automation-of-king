"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "@/lib/api";

export default function Analytics() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking historical trend logic for MVP
        setData([
            { date: 'Mon', sent: 40, received: 35 },
            { date: 'Tue', sent: 30, received: 45 },
            { date: 'Wed', sent: 60, received: 55 },
            { date: 'Thu', sent: 80, received: 70 },
            { date: 'Fri', sent: 50, received: 65 },
            { date: 'Sat', sent: 20, received: 15 },
            { date: 'Sun', sent: 10, received: 25 },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-5xl font-black tracking-tighter">Analytics</h1>
                <p className="text-gray-500 font-medium">Insights into your messaging performance.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <div className="bg-white border p-10 rounded-[40px] shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black">Message Volume</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-200 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Received</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999', fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999', fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="sent" stroke="#000" strokeWidth={4} dot={{ r: 6, fill: '#000', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="received" stroke="#e5e7eb" strokeWidth={4} dot={{ r: 6, fill: '#e5e7eb', strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SmallStat title="Avg Response Time" value="4.2m" trend="-12%" />
                    <SmallStat title="AI Success Rate" value="92.4%" trend="+3%" />
                    <SmallStat title="Lead Quality" value="High" color="text-green-600" />
                </div>
            </div>
        </div>
    );
}

function SmallStat({ title, value, trend, color = "text-black" }: any) {
    return (
        <div className="bg-white border p-8 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
                {trend && <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>}
            </div>
        </div>
    );
}

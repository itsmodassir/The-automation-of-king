"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Billing() {
    const [billing, setBilling] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/billing/status", { token }).then(setBilling).finally(() => setLoading(false));
        }
    }, []);

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-5xl font-black tracking-tighter">Billing</h1>
                <p className="text-gray-500 font-medium text-lg">Scale your business with Aerostic.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <div className="bg-white border p-12 rounded-[40px] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <span className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">Current Plan</span>
                    </div>

                    <h2 className="text-4xl font-black mb-10 tracking-tight">{loading ? '...' : billing?.plan || 'Free Tier'}</h2>

                    <div className="space-y-8 mb-12">
                        <ProgressBar title="Messages Sent" current={billing?.used} limit={billing?.limit} />
                        <ProgressBar title="AI Credits" current={billing?.aiUsed} limit={billing?.aiLimit} />
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-black text-white p-5 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]">
                            Upgrade to Scale
                        </button>
                        <button className="px-8 border rounded-2xl font-bold hover:bg-gray-50 transition-all">Manage with Stripe</button>
                    </div>
                </div>

                <div className="bg-gray-900 text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-4">Enterprise?</h3>
                        <p className="text-gray-400 mb-8 max-w-md">Need dedicated support, custom numbers, or higher throughput? Let's talk about a custom setup.</p>
                        <button className="bg-white text-black px-10 py-4 rounded-2xl font-black">Contact Sales</button>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ title, current, limit }: any) {
    const pct = limit ? Math.min((current / limit) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-end mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</p>
                <p className="text-sm font-black">{current || 0} <span className="text-gray-400 font-bold">/ {limit || '∞'}</span></p>
            </div>
            <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden border">
                <div className="h-full bg-black transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
            </div>
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

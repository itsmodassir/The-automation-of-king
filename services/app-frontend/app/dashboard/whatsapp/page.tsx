"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function WhatsAppSettings() {
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/whatsapp/me", { token }).then(setAccount).finally(() => setLoading(false));
        }
    }, []);

    const startEmbeddedSignup = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/whatsapp/embedded/start?token=${getToken()}`;
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter">WhatsApp Connectivity</h1>
                <p className="text-gray-500 font-medium">Connect your business phone number to Aerostic.</p>
            </div>

            {loading ? (
                <div className="p-10 border rounded-3xl bg-white text-center text-gray-400">Checking connection...</div>
            ) : account ? (
                <div className="bg-white border p-10 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Connected</h3>
                            <p className="text-gray-500">{account.phoneNumberId}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-10">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">WABA ID</p>
                            <p className="font-mono text-gray-700">{account.wabaId || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Status</p>
                            <p className="font-bold text-green-600">Active</p>
                        </div>
                    </div>

                    <button className="text-red-600 font-bold text-sm hover:underline">Disconnect this number</button>
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-[40px] text-center">
                    <h3 className="text-2xl font-black mb-4">No Number Connected</h3>
                    <p className="text-gray-500 mb-10 max-w-xs mx-auto">Start sending messages by connecting your WhatsApp Business account.</p>
                    <button
                        onClick={startEmbeddedSignup}
                        className="bg-black text-white px-10 py-5 rounded-2xl font-black hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        Connect WhatsApp
                    </button>
                </div>
            )}
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

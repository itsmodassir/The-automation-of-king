"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import { TemplateSelector } from "@/components/template-selector";

export default function Inbox() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/conversations", { token }).then(setConversations).finally(() => setLoading(false));

            // REALTIME: Connect to WebSocket
            const socket = require("socket.io-client").io(process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
                query: { tenantId: 'demo-tenant-id' }
            });

            socket.on("message:new", (msg: any) => {
                setMessages(prev => [...prev, msg]);
            });

            return () => socket.disconnect();
        }
    }, []);

    const handleSend = async () => {
        if (!text || !selectedId) return;
        const conv = conversations.find(c => c.id === selectedId);
        await api("/messages/send", {
            method: "POST",
            body: {
                to: conv.contact.phone,
                text,
                phoneNumberId: "mock-id"
            }
        });
        setText("");
    };

    const handleSelectTemplate = (template: any) => {
        setText(`{{template:${template.name}}}`);
        setShowTemplates(false);
    };

    if (loading) return <div className="p-10 font-bold text-center">Loading Inbox...</div>;

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden flex-col md:flex-row">
            {/* Sidebar: hidden on mobile when chat selected */}
            <div className={`w-full md:w-80 border-r dark:border-slate-800 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b dark:border-slate-800">
                    <h1 className="text-xl font-black tracking-tighter uppercase dark:text-white">Inbox</h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`w-full text-left p-6 border-b dark:border-slate-800 transition-all ${selectedId === c.id ? 'bg-black text-white dark:bg-slate-900' : 'hover:bg-gray-50 dark:hover:bg-slate-900/50 dark:text-gray-400'}`}
                        >
                            <div className="font-bold tracking-tight">{c.contact.name || c.contact.phone}</div>
                            <div className={`text-xs mt-1 ${selectedId === c.id ? 'text-gray-400' : 'text-gray-500'}`}>
                                {c.lastMessagePreview || "No messages yet"}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area: full screen on mobile when chat selected */}
            <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
                {selectedId ? (
                    <>
                        <div className="p-4 border-b bg-white dark:bg-slate-950 dark:border-slate-800 flex items-center gap-4">
                            <button onClick={() => setSelectedId(null)} className="md:hidden font-bold text-sm">← Back</button>
                            <div className="font-black text-sm uppercase tracking-widest dark:text-white">
                                {conversations.find(c => c.id === selectedId)?.contact.name}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${m.direction === 'outbound' ? 'bg-black text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-tl-none'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white border-t shadow-2xl">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <input
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all font-medium pr-20"
                                        placeholder="Describe your reply..."
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-black">📎</button>
                                        <button className="p-2 text-gray-400 hover:text-black">🤖</button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSend}
                                    className="bg-black text-white px-8 py-5 rounded-2x; font-black shadow-lg hover:shadow-2xl transition-all active:scale-[0.98] h-full"
                                >
                                    SEND
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-6">💬</div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Zero distractions.</h3>
                        <p className="text-gray-400 max-w-xs font-medium">Select a conversation from the left to start engaging with your customers.</p>
                    </div>
                )}
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

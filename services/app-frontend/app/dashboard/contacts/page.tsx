"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/contacts", { token }).then(setContacts).finally(() => setLoading(false));
        }
    }, []);

    return (
        <div className="p-10 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Contacts</h1>
                    <p className="text-gray-500 font-medium">Global address book for your workspace.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold">Add Contact</button>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y">
                    {contacts.length === 0 ? (
                        <div className="p-20 text-center text-gray-400 italic">No contacts found. Send a message to get started!</div>
                    ) : (
                        contacts.map((c: any) => (
                            <div key={c.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <h4 className="font-bold">{c.name || 'Anonymous'}</h4>
                                    <p className="text-sm text-gray-400 font-mono">{c.phoneNumber}</p>
                                </div>
                                <a href={`/dashboard/inbox?id=${c.id}`} className="text-sm font-bold hover:underline">Chat</a>
                            </div>
                        ))
                    )}
                </div>
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

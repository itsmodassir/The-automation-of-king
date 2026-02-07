"use client";
import { useState } from "react";

export function TemplateSelector({ onSelect }: { onSelect: (template: any) => void }) {
    const [templates] = useState([
        { id: '1', name: 'order_update', language: 'en_US', category: 'UTILITY' },
        { id: '2', name: 'welcome_message', language: 'en_US', category: 'MARKETING' },
        { id: '3', name: 'billing_alert', language: 'en_US', category: 'UTILITY' },
    ]);

    return (
        <div className="bg-white border rounded-2xl shadow-2xl p-6 w-80 absolute bottom-20 right-0 z-50 animate-in fade-in slide-in-from-bottom-5">
            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-gray-400">Approved Templates</h3>
            <div className="space-y-2">
                {templates.map(t => (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t)}
                        className="w-full text-left p-4 rounded-xl border hover:bg-gray-50 transition-all group"
                    >
                        <div className="font-bold text-sm tracking-tight">{t.name}</div>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{t.category} • {t.language}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

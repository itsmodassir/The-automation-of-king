"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TeamSettings() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app: api("/users", { token })
        setTeam([
            { id: '1', email: 'admin@aerostic.com', role: 'admin' },
            { id: '2', email: 'agent1@aerostic.com', role: 'agent' },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Team Management</h1>
                    <p className="text-gray-500 font-medium">Invite and manage workspace members.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold">Invite Member</button>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <tr>
                            <th className="p-6">Member</th>
                            <th className="p-6">Role</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {team.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-6 font-medium">{m.email}</td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${m.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {m.role}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-gray-400 hover:text-black">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

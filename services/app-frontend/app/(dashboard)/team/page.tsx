"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { UserPlus, Mail, Shield, MoreVertical } from "lucide-react";

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const data = await api("/api/users");
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch team members:", error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading team...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                    <p className="text-gray-500 mt-2">Manage your team members and their access levels.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <UserPlus size={20} />
                    Invite Member
                </button>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-4 font-semibold text-xs uppercase text-gray-500">Member</th>
                            <th className="text-left p-4 font-semibold text-xs uppercase text-gray-500">Role</th>
                            <th className="text-left p-4 font-semibold text-xs uppercase text-gray-500">Status</th>
                            <th className="text-left p-4 font-semibold text-xs uppercase text-gray-500">Joined</th>
                            <th className="text-right p-4 font-semibold text-xs uppercase text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <UserPlus className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p>No team members yet. Invite your first member!</p>
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">
                                                    {member.name?.charAt(0) || "U"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{member.name || "Unknown"}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                            <Shield size={14} />
                                            {member.role || "Member"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${member.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {member.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                            <MoreVertical size={18} className="text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

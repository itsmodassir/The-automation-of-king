"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Shield, UserPlus, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import Link from 'next/link';

export default function Admins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = () => {
        api("/admin/admins")
            .then(setAdmins)
            .catch(() => setAdmins([]))
            .finally(() => setLoading(false));
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        if (!confirm(`Are you sure you want to ${newStatus ? 'enable' : 'disable'} this admin?`)) return;

        setActionLoading(id);
        try {
            await api(`/admin/admins/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: newStatus })
            });
            fetchAdmins();
        } catch (e) {
            alert("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8">Loading team...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Team Members</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage admin access and roles.</p>
                </div>
                <Link href="/dashboard/admins/create" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <UserPlus size={16} />
                    Add Member
                </Link>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Member</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Role</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Status</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Joined</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {admins.map((admin: any) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-sm">{admin.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                        {admin.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {admin.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(admin.id, admin.isActive)}
                                        disabled={actionLoading === admin.id}
                                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                                    >
                                        {admin.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admins.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Shield className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>No other admins found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

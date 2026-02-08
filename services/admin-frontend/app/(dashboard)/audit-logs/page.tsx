"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FileText, Search, Filter } from "lucide-react";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = () => {
        api("/admin/audit-logs")
            .then(setLogs)
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    };

    const filteredLogs = logs.filter((log: any) =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading audit logs...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Audit Logs</h2>
                    <p className="text-gray-500 text-sm mt-1">Track all system actions and changes.</p>
                </div>
                <button onClick={fetchLogs} className="text-sm text-gray-500 hover:text-black">
                    Refresh
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by action or actor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Timestamp</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Action</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Actor</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Tenant</th>
                            <th className="p-4 font-semibold text-xs uppercase text-gray-500">Metadata</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredLogs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-mono text-gray-600">
                                    {log.actorId ? log.actorId.substring(0, 8) + '...' : 'System'}
                                </td>
                                <td className="p-4 text-sm font-mono text-gray-600">
                                    {log.tenantId ? log.tenantId.substring(0, 8) + '...' : '-'}
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    {log.metadata && Object.keys(log.metadata).length > 0 ? (
                                        <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>{searchTerm ? 'No logs match your search.' : 'No audit logs found.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

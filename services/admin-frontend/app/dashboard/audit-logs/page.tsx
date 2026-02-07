"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Shield, Clock } from "lucide-react";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<any[]>("/admin/audit-logs")
            .then((data) => setLogs(data || []))
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading logs...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Audit Logs</h2>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {logs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Shield className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>No audit logs found.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {logs.map((log: any) => (
                            <div key={log.id} className="p-4 hover:bg-gray-50 flex items-start gap-4 transition-colors">
                                <div className="mt-1 bg-gray-100 p-2 rounded-lg">
                                    <Clock size={16} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-sm">{log.action}</p>
                                        <span className="text-xs text-gray-400">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Actor: <span className="font-mono bg-gray-100 px-1 rounded">{log.actorId || 'System'}</span>
                                    </p>
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <pre className="mt-2 text-[10px] bg-gray-50 p-2 rounded border overflow-x-auto text-gray-600">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

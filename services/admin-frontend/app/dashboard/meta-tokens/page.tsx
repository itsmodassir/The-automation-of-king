"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Key, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";

export default function MetaTokens() {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rotating, setRotating] = useState<string | null>(null);

    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = () => {
        api<any[]>("/admin/meta/tokens")
            .then((data) => setTokens(data || []))
            .catch(() => setTokens([]))
            .finally(() => setLoading(false));
    };

    const rotateToken = async (id: string, platform: string) => {
        if (!confirm("Are you sure? This will generate a new token.")) return;
        setRotating(id);
        try {
            await api("/admin/meta/tokens/rotate", {
                method: "POST",
                body: JSON.stringify({ tokenId: id, platform }),
            });
            alert("Token rotated successfully");
            fetchTokens();
        } catch (e) {
            alert("Failed to rotate token");
        } finally {
            setRotating(null);
        }
    };

    if (loading) return <div className="p-8">Loading tokens...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Meta System Tokens</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage platform-level access tokens for WhatsApp/Facebook.</p>
                </div>
                <button onClick={fetchTokens} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCcw size={18} />
                </button>
            </div>

            <div className="grid gap-4">
                {tokens.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border text-center text-gray-500">
                        <Key className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>No Meta tokens configured.</p>
                    </div>
                ) : (
                    tokens.map((token: any) => (
                        <div key={token.id} className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${token.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {token.isActive ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg capitalize">{token.platform} Token</h4>
                                    <p className="text-xs text-gray-400 font-mono mt-1 break-all max-w-md">
                                        ID: {token.id}
                                    </p>
                                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                        <span>Expires: {new Date(token.expiresAt).toLocaleDateString()}</span>
                                        <span>Last Rotated: {new Date(token.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => rotateToken(token.id, token.platform)}
                                disabled={!!rotating}
                                className="border border-gray-200 hover:bg-black hover:text-white hover:border-black px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCcw size={14} className={rotating === token.id ? "animate-spin" : ""} />
                                {rotating === token.id ? "Rotating..." : "Rotate Token"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

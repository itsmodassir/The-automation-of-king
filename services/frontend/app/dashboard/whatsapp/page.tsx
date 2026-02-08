"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageCircle, CheckCircle, XCircle, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

export default function WhatsAppPage() {
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchAccount();

        // Handle OAuth callback params
        const successParam = searchParams.get('success');
        const errorParam = searchParams.get('error');

        if (successParam === 'true') {
            setSuccess('WhatsApp account connected successfully!');
            // Clean URL
            router.replace('/dashboard/whatsapp');
        }

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            router.replace('/dashboard/whatsapp');
        }
    }, [searchParams, router]);

    const fetchAccount = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch("/api/whatsapp/me", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setConnected(data.connected);
                setAccount(data.account);
            }
        } catch (error) {
            console.error("Failed to fetch WhatsApp account:", error);
            setConnected(false);
            setAccount(null);
        } finally {
            setLoading(false);
        }
    };

    const startEmbeddedSignup = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch("/api/whatsapp/embedded/start", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    // Open in new window/popup for better UX
                    window.location.href = data.url;
                }
            }
        } catch (error) {
            console.error("Failed to start embedded signup:", error);
            setError("Failed to start embedded signup process");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">WhatsApp Account</h1>
                <p className="text-gray-500 mt-2">Manage your WhatsApp Business account connection.</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {connected && account ? (
                <div className="space-y-6">
                    {/* Account Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <MessageCircle className="text-green-600" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Connected</h3>
                                    <h3 className="font-medium text-gray-900">{account.businessName || "WhatsApp Business"}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Your WhatsApp account is active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                        <div className="divide-y divide-gray-100">
                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Phone Number</span>
                                <span className="font-semibold text-gray-900 font-mono">{account.displayPhoneNumber || account.phoneNumber || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Business Name</span>
                                <span className="font-semibold text-gray-900">{account.businessName || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Configuration ID</span>
                                <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">{account.wabaId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Status</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold capitalize">
                                    {account.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={fetchAccount}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
                            >
                                <RefreshCw size={20} />
                                Refresh Connection
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">
                                <XCircle size={20} />
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm max-w-2xl mx-auto mt-8">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect Your WhatsApp Account</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                        Link your WhatsApp Business account to start sending automated messages, managing contacts, and tracking analytics directly from your dashboard.
                    </p>
                    <button
                        onClick={startEmbeddedSignup}
                        className="bg-[#25D366] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#20bd5a] transition inline-flex items-center gap-3 shadow-lg shadow-green-100 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <MessageCircle size={24} className="fill-current" />
                        Connect with WhatsApp
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        Secure connection via Meta Business Platform
                    </p>
                </div>
            )}
        </div>
    );
}

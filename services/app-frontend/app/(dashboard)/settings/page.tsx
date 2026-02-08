"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, Upload } from "lucide-react";

export default function SettingsPage() {
    const [branding, setBranding] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBranding();
    }, []);

    const fetchBranding = async () => {
        try {
            const data = await api("/api/tenants/branding");
            setBranding(data);
        } catch (error) {
            console.error("Failed to fetch branding:", error);
            setBranding({ logo: "", primaryColor: "#3B82F6", companyName: "" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api("/api/tenants/branding", {
                method: "POST",
                body: JSON.stringify(branding),
            });
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-2">Manage your account and workspace preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Branding */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={branding.companyName || ""}
                            onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Your Company Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={branding.logo || ""}
                                onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="https://example.com/logo.png"
                            />
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <Upload size={20} />
                                Upload
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={branding.primaryColor || "#3B82F6"}
                                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={branding.primaryColor || "#3B82F6"}
                                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="#3B82F6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive email updates about new messages</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Weekly Reports</p>
                            <p className="text-sm text-gray-500">Get weekly analytics reports via email</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                    </label>
                </div>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value="sk_live_••••••••••••••••••••"
                                readOnly
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                            />
                            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Regenerate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

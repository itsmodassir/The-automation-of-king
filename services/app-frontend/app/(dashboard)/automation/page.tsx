"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Zap, Plus, ToggleLeft, ToggleRight } from "lucide-react";

export default function AutomationPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await api("/api/automation/settings");
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch automation settings:", error);
            setSettings({ enabled: false, rules: [] });
        } finally {
            setLoading(false);
        }
    };

    const toggleAutomation = async () => {
        try {
            const newSettings = { ...settings, enabled: !settings.enabled };
            await api("/api/automation/settings", {
                method: "POST",
                body: JSON.stringify(newSettings),
            });
            setSettings(newSettings);
        } catch (error) {
            console.error("Failed to toggle automation:", error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading automation...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
                    <p className="text-gray-500 mt-2">Set up automated responses and workflows for your WhatsApp business.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <Plus size={20} />
                    Create Rule
                </button>
            </div>

            {/* Master Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Automation Status</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {settings.enabled ? "Automation is currently active" : "Automation is currently disabled"}
                        </p>
                    </div>
                    <button
                        onClick={toggleAutomation}
                        className={`p-3 rounded-lg transition ${settings.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {settings.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                </div>
            </div>

            {/* Automation Rules */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Rules</h3>

                {settings.rules && settings.rules.length > 0 ? (
                    <div className="space-y-4">
                        {settings.rules.map((rule: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rule.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {rule.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Zap className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>No automation rules yet. Create your first rule to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

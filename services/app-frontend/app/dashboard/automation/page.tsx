"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Automation() {
    const [settings, setSettings] = useState<any>({ aiEnabled: true, aiConfidenceThreshold: 0.7 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            api("/automation/settings", { token }).then(setSettings).finally(() => setLoading(false));
        }
    }, []);

    const save = async () => {
        setSaving(true);
        const token = getToken();
        await api("/automation/settings", {
            method: "POST",
            token,
            body: settings
        });
        setSaving(false);
    };

    if (loading) return <div className="p-10">Loading settings...</div>;

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter">AI Automation</h1>
                <p className="text-gray-500 font-medium">Control how Aerostic handles inbound messages.</p>
            </div>

            <div className="space-y-8 bg-white border p-10 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold">AI Auto-Reply</h4>
                        <p className="text-sm text-gray-400">Enable Gemini to reply automatically to low-risk messages.</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, aiEnabled: !settings.aiEnabled })}
                        className={`w-14 h-8 rounded-full transition-colors relative ${settings.aiEnabled ? 'bg-black' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.aiEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div>
                    <div className="flex justify-between mb-4">
                        <h4 className="font-bold">Confidence Threshold</h4>
                        <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded">{(settings.aiConfidenceThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">AI will only reply if it is more than {settings.aiConfidenceThreshold * 100}% certain of the answer.</p>
                    <input
                        type="range"
                        min="0.5"
                        max="0.99"
                        step="0.01"
                        value={settings.aiConfidenceThreshold}
                        onChange={e => setSettings({ ...settings, aiConfidenceThreshold: parseFloat(e.target.value) })}
                        className="w-full accent-black cursor-pointer"
                    />
                </div>

                <button
                    onClick={save}
                    disabled={saving}
                    className="w-full bg-black text-white p-4 rounded-xl font-bold active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

function getToken() {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1];
}

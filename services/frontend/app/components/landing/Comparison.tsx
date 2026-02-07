"use client";
import { Check, X } from "lucide-react";

export default function Comparison() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Leaders Choose Aerostic</h2>
                    <p className="text-gray-600 text-lg">Compare us with other WhatsApp providers.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full max-w-4xl mx-auto text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-gray-500 font-medium">Feature</th>
                                <th className="p-4 text-center font-bold text-lg text-green-600 bg-green-50 rounded-t-xl">Aerostic</th>
                                <th className="p-4 text-center font-medium text-gray-500">Others (WATI, AiSensy, etc.)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { feature: "Official Meta API", us: true, them: true },
                                { feature: "AI Knowledge Base Integration", us: true, them: false },
                                { feature: "Unlimited Team Members", us: true, them: "Extra Cost" },
                                { feature: "Smart Ban Protection", us: true, them: false },
                                { feature: "Custom API Access", us: true, them: "Limited" },
                                { feature: "Multi-Tenant Agency Mode", us: true, them: false },
                            ].map((row, index) => (
                                <tr key={index}>
                                    <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                                    <td className="p-4 text-center bg-green-50/30">
                                        {row.us === true ? <Check className="w-6 h-6 text-green-600 mx-auto" /> : <span className="text-green-700 font-bold">{row.us}</span>}
                                    </td>
                                    <td className="p-4 text-center text-gray-500">
                                        {row.them === false ? <X className="w-6 h-6 text-red-400 mx-auto" /> :
                                            row.them === true ? <Check className="w-6 h-6 text-gray-400 mx-auto" /> :
                                                <span>{row.them}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

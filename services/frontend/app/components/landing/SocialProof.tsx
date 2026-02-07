"use client";
import { Star } from "lucide-react";

export default function SocialProof() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Trusted by Growing Teams</h2>
                    <div className="flex justify-center gap-1 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            quote: "Aerostic saved us from a WhatsApp ban nightmare. The official API setup was instant.",
                            author: "Sarah J.",
                            role: "Marketing Director"
                        },
                        {
                            quote: "The AI auto-reply feature handled 80% of our support tickets in the first week.",
                            author: "Mike T.",
                            role: "Founder, TechStart"
                        },
                        {
                            quote: "Finally, a WhatsApp tool that focuses on scale and reliability. Support is top-notch.",
                            author: "Elena R.",
                            role: "VP of Sales"
                        }
                    ].map((testi, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-600 mb-6 italic">"{testi.quote}"</p>
                            <div>
                                <div className="font-bold text-gray-900">{testi.author}</div>
                                <div className="text-sm text-gray-500">{testi.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

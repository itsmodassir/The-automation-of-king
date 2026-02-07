"use client";
import { AlertTriangle, XCircle, Users, ZapOff } from "lucide-react";

export default function Problem() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Businesses Struggle with WhatsApp</h2>
                    <p className="text-gray-600 text-lg">Unofficial tools and manual processes are holding back your growth.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: <AlertTriangle className="w-10 h-10 text-red-500" />,
                            title: "Risk of Bans",
                            description: "Using unofficial tools puts your number at risk of permanent bans from WhatsApp."
                        },
                        {
                            icon: <ZapOff className="w-10 h-10 text-orange-500" />,
                            title: "Limited Automation",
                            description: "Manual replies scale poorly. You lose leads while your team sleeps."
                        },
                        {
                            icon: <Users className="w-10 h-10 text-blue-500" />,
                            title: "Message Chaos",
                            description: "No shared inbox means lost context, duplicate replies, and frustrated customers."
                        },
                        {
                            icon: <XCircle className="w-10 h-10 text-gray-500" />,
                            title: "Complex Setup",
                            description: "Most API providers require developers and days of configuration."
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl inline-block">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

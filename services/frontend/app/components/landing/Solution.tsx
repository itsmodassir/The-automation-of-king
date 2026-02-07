"use client";
import { CheckCircle2, ShieldCheck, Cpu, BarChart3 } from "lucide-react";

export default function Solution() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            <span>The Aerostic Advantage</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Scale Without Fear. <br />
                            <span className="text-blue-600">Automate with Control.</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            We bridge the gap between AI automation and human connection.
                            Built directly on the Meta Cloud API for maximum reliability and compliance.
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "100% Meta Compliant",
                                    description: "Official API architecture ensures your number stays safe forever."
                                },
                                {
                                    title: "AI + Human Handoff",
                                    description: "Let AI handle 80% of queries. Agents step in only when needed."
                                },
                                {
                                    title: "Enterprise Scalability",
                                    description: "Send 1M+ messages/day with reliable delivery and reporting."
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative bg-gray-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                        {/* Placeholder for Solution Image/Graphic */}
                        <div className="text-center text-gray-400">
                            <div className="mb-4">
                                <Cpu className="w-24 h-24 mx-auto opacity-20" />
                            </div>
                            <p className="font-medium">Platform Dashboard UI Preview</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

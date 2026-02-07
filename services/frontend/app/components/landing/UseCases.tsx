"use client";
import { Briefcase, Headphones, Building, TrendingUp } from "lucide-react";

export default function UseCases() {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Built for Every Team</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                            title: "Sales Teams",
                            description: "Close deals faster with automated follow-ups and instant lead qualification."
                        },
                        {
                            icon: <Headphones className="w-8 h-8 text-blue-600" />,
                            title: "Support",
                            description: "Reduce ticket volume by 50% with AI chatbots and smart routing."
                        },
                        {
                            icon: <Briefcase className="w-8 h-8 text-purple-600" />,
                            title: "Agencies",
                            description: "Manage multiple client accounts from a single dashboard. White-label ready."
                        },
                        {
                            icon: <Building className="w-8 h-8 text-orange-600" />,
                            title: "Enterprises",
                            description: "Bank-grade security, SSO, and dedicated success managers for scale."
                        }
                    ].map((item, index) => (
                        <div key={index} className="p-6 border border-gray-100 rounded-xl hover:border-green-100 hover:bg-green-50/30 transition-colors">
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

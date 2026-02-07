"use client";
import { MessageSquare, Bot, Send, PieChart, Users, Globe } from "lucide-react";

export default function Features() {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale</h2>
                    <p className="text-gray-400 text-lg">Powerful features wrapped in a simple, intuitive interface.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
                            title: "Smart Shared Inbox",
                            description: "Assign chats, tag conversations, and collaborate with your team in real-time."
                        },
                        {
                            icon: <Bot className="w-8 h-8 text-purple-400" />,
                            title: "AI Auto-Responses",
                            description: "Train our AI on your docs to answer FAQs instantly, 24/7."
                        },
                        {
                            icon: <Send className="w-8 h-8 text-green-400" />,
                            title: "Bulk Broadcasts",
                            description: "Send personalized campaigns to thousands of customers with one click."
                        },
                        {
                            icon: <PieChart className="w-8 h-8 text-yellow-400" />,
                            title: "Deep Analytics",
                            description: "Track open rates, response times, and team performance metrics."
                        },
                        {
                            icon: <Users className="w-8 h-8 text-pink-400" />,
                            title: "Team Roles & Permissions",
                            description: "Granular control over who can see what. Secure by design."
                        },
                        {
                            icon: <Globe className="w-8 h-8 text-cyan-400" />,
                            title: "Multi-Language Support",
                            description: "Automatically translate incoming messages and replies."
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-gray-800 p-8 rounded-2xl hover:bg-gray-750 transition-colors border border-gray-700">
                            <div className="mb-6">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

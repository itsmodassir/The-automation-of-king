"use client";
// import { Check, X } from "lucide-react";

const Check = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const X = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 18 18" />
    </svg>
);

export default function Pricing() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600">Choose the perfect plan for your business growth.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {/* Starter Plan */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-green-200 hover:shadow-md transition-all">
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Starter</h3>
                        <p className="text-xs text-gray-500 mb-4 h-8">Individuals & Small Businesses</p>
                        <div className="mb-4">
                            <span className="text-3xl font-bold">₹999</span><span className="text-gray-500 text-sm">/mo</span>
                            <div className="text-xs text-green-600 font-medium mt-1">₹0 Setup Fee</div>
                        </div>
                        <a href="/dashboard" className="w-full py-2.5 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors mb-6 text-sm text-center">Start Free Trial</a>
                        <ul className="space-y-3 flex-1">
                            {[
                                "1 WhatsApp Number",
                                "100 AI Credits/mo",
                                "1 Basic Auto-reply Bot",
                                "Unlimited Contacts",
                                "5,000 Broadcasts/mo*",
                                "Google Sheets Integration",
                                "Manual Human Takeover",
                                "Email Support"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Starter Plus Plan */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-green-200 hover:shadow-md transition-all">
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Starter Plus</h3>
                        <p className="text-xs text-gray-500 mb-4 h-8">Growing Businesses</p>
                        <div className="mb-4">
                            <span className="text-3xl font-bold">₹2,499</span><span className="text-gray-500 text-sm">/mo</span>
                            <div className="text-xs text-green-600 font-medium mt-1">₹0 Setup Fee</div>
                        </div>
                        <a href="/dashboard" className="w-full py-2.5 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors mb-6 text-sm text-center">Select Plan</a>
                        <ul className="space-y-3 flex-1">
                            {[
                                "Everything in Starter",
                                "500 AI Credits/mo",
                                "3 Auto-reply Bots",
                                "20,000 Broadcasts/mo*",
                                "Faster Sync",
                                "Improved Automation Rules",
                                "Priority Email Support"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Growth Plan (Highlighted) */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-green-500 shadow-xl flex flex-col relative scale-105 z-10">
                        <div className="absolute top-0 center bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg left-1/2 -translate-x-1/2 uppercase tracking-wide">Most Popular</div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 mt-2">Growth</h3>
                        <p className="text-xs text-gray-500 mb-4 h-8">Real Estate, Coaches, Service Providers</p>
                        <div className="mb-4">
                            <span className="text-3xl font-bold">₹3,999</span><span className="text-gray-500 text-sm">/mo</span>
                            <div className="text-xs text-gray-500 font-medium mt-1">₹4,999 Setup Fee</div>
                        </div>
                        <a href="/dashboard" className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mb-6 text-sm text-center shadow-lg shadow-green-200">Get Started</a>
                        <ul className="space-y-3 flex-1">
                            {[
                                "Up to 3 WhatsApp Numbers",
                                "1,000 AI Credits/mo",
                                "Smart Lead Detection",
                                "CRM Sync (HubSpot, etc.)",
                                "Inbound Group Capture",
                                "Auto Follow-up Sequences",
                                "Campaign Scheduler",
                                "Admin Dashboard",
                                "Priority Support (WA + Email)"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-900 font-medium">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Professional Plan */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-green-200 hover:shadow-md transition-all">
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Professional</h3>
                        <p className="text-xs text-gray-500 mb-4 h-8">Agencies & High Volume</p>
                        <div className="mb-4">
                            <span className="text-3xl font-bold">₹6,999</span><span className="text-gray-500 text-sm">/mo</span>
                            <div className="text-xs text-gray-500 font-medium mt-1">₹29,999 Setup Fee</div>
                        </div>
                        <a href="/contact" className="w-full py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors mb-6 text-sm text-center">Contact Sales</a>
                        <ul className="space-y-3 flex-1">
                            {[
                                "Up to 5 WhatsApp Numbers",
                                "Multi-client Dashboard",
                                "Advanced Lead Tagging",
                                "AI Message Classification",
                                "Duplicate Lead Detection",
                                "Webhooks + API Access",
                                "Role-based Access",
                                "Priority Call Support"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold mb-2 text-white">Enterprise</h3>
                        <p className="text-xs text-gray-400 mb-4 h-8">Large Companies & SaaS</p>
                        <div className="mb-4">
                            <div className="text-xs text-gray-400 font-medium mb-1">Starting from</div>
                            <span className="text-3xl font-bold">₹49,999</span>
                        </div>
                        <a href="/contact" className="w-full py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-6 text-sm text-center">Talk to Expert</a>
                        <ul className="space-y-3 flex-1">
                            {[
                                "Unlimited WhatsApp Numbers",
                                "Custom Workflow Automation",
                                "Meta Embedded Signup",
                                "White-labeled Dashboard",
                                "Custom API Endpoints",
                                "Dedicated Server / VPC",
                                "SLA-backed Uptime",
                                "Dedicated Support Engineer"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 text-center text-sm text-gray-500">
                    *Meta conversation charges apply directly to your WhatsApp Business Account.
                </div>
            </div>
        </section>
    );
}

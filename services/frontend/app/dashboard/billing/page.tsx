"use client";
import { CreditCard, TrendingUp, Download } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                <p className="text-gray-500 mt-2">Manage your subscription plan and billing information.</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Professional Plan</h3>
                        <p className="text-blue-100 mb-6">Perfect for growing businesses</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">₹4,999</span>
                            <span className="text-blue-100">/month</span>
                        </div>
                    </div>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Usage */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Usage</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Messages</span>
                            <span className="font-semibold text-gray-900">250 / 1,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Contacts</span>
                            <span className="font-semibold text-gray-900">45 / 500</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "9%" }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Team Members</span>
                            <span className="font-semibold text-gray-900">2 / 5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: "40%" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">Update</button>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                            <div>
                                <p className="font-semibold text-gray-900">Professional Plan</p>
                                <p className="text-sm text-gray-500">Jan {i}, 2026</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-900">₹4,999</span>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <Download size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

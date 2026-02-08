"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, removeToken } from "@/lib/api";
import Link from "next/link";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Zap,
    BarChart3,
    MessageCircle,
    UserPlus,
    CreditCard,
    Settings,
    LogOut,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Automation", href: "/dashboard/automation", icon: Zap },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "WhatsApp", href: "/dashboard/whatsapp", icon: MessageCircle },
    { name: "Team", href: "/dashboard/team", icon: UserPlus },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        removeToken();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Aerostic</h1>
                    <p className="text-xs text-gray-500 mt-1">WhatsApp Business</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition w-full"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}

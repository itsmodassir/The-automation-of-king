"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Key,
    LogOut,
    Settings
} from "lucide-react";

const menuItems = [
    { name: "Control Tower", href: "/", icon: LayoutDashboard },
    { name: "Tenants", href: "/tenants", icon: Users },
    { name: "Team", href: "/admins", icon: Settings }, // "Admins" renamed to "Team" for better UI
    { name: "Meta Tokens", href: "/meta", icon: Key },
    { name: "Audit Logs", href: "/logs", icon: ShieldAlert },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-black text-white h-screen flex flex-col fixed left-0 top-0 border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-xl">A</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Aerostic</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 uppercase tracking-widest font-semibold ml-1">
                    Admin Console
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-400 hover:text-white hover:bg-gray-900"
                                }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={() => {
                        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                        localStorage.removeItem("admin_token");
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

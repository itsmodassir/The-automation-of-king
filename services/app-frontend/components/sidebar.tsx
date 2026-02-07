"use client";

export function Sidebar() {
    return (
        <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col dark:bg-slate-900 border-r dark:border-slate-800">
            <h2 className="text-2xl font-black tracking-tighter mb-10">{process.env.NEXT_PUBLIC_BRAND_NAME || 'AEROSTIC'}</h2>
            <nav className="flex-1 space-y-4 text-sm font-medium">
                <a href="/dashboard" className="block hover:text-gray-400">Overview</a>
                <a href="/dashboard/inbox" className="block hover:text-gray-400">Inbox</a>
                <a href="/dashboard/contacts" className="block hover:text-gray-400">Contacts</a>
                <a href="/dashboard/automation" className="block hover:text-gray-400">Automation</a>
                <a href="/dashboard/analytics" className="block hover:text-gray-400">Analytics</a>
                <div className="pt-10 text-xs uppercase tracking-widest text-gray-500 font-bold">Settings</div>
                <a href="/dashboard/whatsapp" className="block hover:text-gray-400">WhatsApp</a>
                <a href="/dashboard/team" className="block hover:text-gray-400">Team</a>
                <a href="/dashboard/billing" className="block hover:text-gray-400">Billing</a>
                <a href="/dashboard/settings" className="block hover:text-gray-400">Settings</a>
            </nav>
            <div className="pt-6 border-t border-gray-800">
                <button
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="w-full text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                    🌓 Toggle Theme
                </button>
            </div>
        </aside>
    );
}

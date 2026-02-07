"use client";

import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const pageName = pathname.split('/').pop() || 'Dashboard';
    const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');

    return (
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between sticky top-0 z-10">
            <h2 className="text-lg font-semibold capitalize">
                {pathname === '/dashboard' ? 'Control Tower' : formattedName}
            </h2>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border text-xs font-bold">
                    SA
                </div>
            </div>
        </header>
    );
}

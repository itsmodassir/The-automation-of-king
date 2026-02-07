"use client";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}

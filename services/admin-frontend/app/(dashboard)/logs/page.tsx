"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/audit-logs");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Redirecting to Audit Logs...</p>
        </div>
    );
}

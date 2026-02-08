"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsageRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/quotas");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Redirecting to Quotas...</p>
        </div>
    );
}

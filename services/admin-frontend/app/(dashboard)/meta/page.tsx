"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MetaRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/meta-tokens");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Redirecting to Meta Tokens...</p>
        </div>
    );
}

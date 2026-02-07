"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/api";

export function BrandingLoader() {
    const [branding, setBranding] = useState<any>(null);

    useEffect(() => {
        // PUBLIC: Fetch branding based on current Host domain (White-label support)
        api("/tenants/public/branding").then(setBranding).catch(console.error);
    }, []);

    useEffect(() => {
        if (branding) {
            document.documentElement.style.setProperty('--brand-color', branding.primaryColor);
            if (branding.brandName) {
                // Option to update document title or other elements
            }
        }
    }, [branding]);

    return null;
}

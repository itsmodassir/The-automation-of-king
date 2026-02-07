"use client";
import { Shield, Lock, Server, CheckCircle, Zap } from "lucide-react";

export default function TrustStrip() {
    return (
        <section className="py-10 border-y border-gray-100 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
                        <Shield className="w-6 h-6" />
                        <span>Meta Verified</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
                        <Lock className="w-6 h-6" />
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
                        <Server className="w-6 h-6" />
                        <span>99.99% Uptime</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
                        <Zap className="w-6 h-6" />
                        <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
                        <CheckCircle className="w-6 h-6" />
                        <span>Official Partner</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

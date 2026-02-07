"use client";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 bg-green-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-800 via-green-900 to-green-950"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Scale Your WhatsApp Engine?</h2>
                <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                    Join hundreds of businesses switching to the official, safe, and scalable way to grow.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="/dashboard" className="px-8 py-4 bg-white text-green-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        Get Started for Free
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    <a href="/contact" className="px-8 py-4 bg-transparent border border-green-400 text-white rounded-xl font-bold text-lg hover:bg-green-800/50 transition-colors">
                        Talk to Sales
                    </a>
                </div>
                <p className="mt-8 text-sm text-green-400 opacity-80">No credit card required · 14-day free trial · Cancel anytime</p>
            </div>
        </section>
    );
}

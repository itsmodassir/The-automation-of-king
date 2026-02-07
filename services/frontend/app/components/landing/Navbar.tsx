"use client";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <a href="/" className="text-2xl font-black tracking-tighter text-gray-900">
                    AEROSTIC
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
                    <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
                    <a href="#solutions" className="hover:text-green-600 transition-colors">Solutions</a>
                    <a href="#pricing" className="hover:text-green-600 transition-colors">Pricing</a>
                    <a href="#resources" className="hover:text-green-600 transition-colors">Resources</a>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <a href="/login" className="text-sm font-bold text-gray-900 hover:text-green-600 transition-colors">Log In</a>
                    <a href="/dashboard" className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 p-4 shadow-xl">
                    <nav className="flex flex-col gap-4 text-center font-medium">
                        <a href="#features" className="py-2 hover:text-green-600">Features</a>
                        <a href="#pricing" className="py-2 hover:text-green-600">Pricing</a>
                        <a href="/login" className="py-2 text-gray-900">Log In</a>
                        <a href="/dashboard" className="py-3 bg-green-600 text-white rounded-lg">Get Started</a>
                    </nav>
                </div>
            )}
        </header>
    );
}

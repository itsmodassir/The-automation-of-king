"use client";
import { Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-bold text-white mb-6">AEROSTIC</div>
                        <p className="max-w-xs mb-8">
                            The official WhatsApp automation platform for high-growth teams. Safe, scalable, and built for business.
                        </p>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:support@aerostic.com" className="hover:text-white transition-colors">support@aerostic.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Global Headquarters</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/aerostic" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="https://linkedin.com/company/aerostic" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="https://facebook.com/aerostic" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="https://instagram.com/aerostic" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="/data-deletion" className="hover:text-white transition-colors">Data Deletion</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
                    <div>&copy; {new Date().getFullYear()} Aerostic. All rights reserved.</div>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <a href="/privacy-policy" className="hover:text-white">Privacy</a>
                        <a href="/terms" className="hover:text-white">Terms</a>
                        <a href="/data-deletion" className="hover:text-white">Data Deletion</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

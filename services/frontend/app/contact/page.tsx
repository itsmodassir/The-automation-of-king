"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-xl text-blue-100 max-w-2xl">
                            Have questions about Aerostic? Our team is here to help. Reach out to us today!
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div>
                                <h2 className="text-3xl font-bold mb-8 text-gray-900">Contact Information</h2>
                                
                                <div className="space-y-8">
                                    {/* Email */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Mail className="w-8 h-8 text-blue-600 mt-1" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                                            <p className="text-gray-600 mb-2">For general inquiries and support:</p>
                                            <a href="mailto:support@aerostic.com" className="text-blue-600 hover:text-blue-800 font-semibold">
                                                support@aerostic.com
                                            </a>
                                            <p className="text-gray-600 text-sm mt-3">Response time: Within 24 hours</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Phone className="w-8 h-8 text-blue-600 mt-1" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                                            <p className="text-gray-600 mb-2">Call our sales and support team:</p>
                                            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800 font-semibold">
                                                +1 (234) 567-890
                                            </a>
                                            <p className="text-gray-600 text-sm mt-3">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <MapPin className="w-8 h-8 text-blue-600 mt-1" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Headquarters</h3>
                                            <p className="text-gray-600 mb-2">
                                                Aerostic Global Inc.<br />
                                                1234 Innovation Drive<br />
                                                San Francisco, CA 94105<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>

                                    {/* Alternative Contact */}
                                    <div className="bg-blue-50 p-6 rounded-lg mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Contact Methods</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li><strong>Sales:</strong> sales@aerostic.com</li>
                                            <li><strong>Enterprise:</strong> enterprise@aerostic.com</li>
                                            <li><strong>Technical Support:</strong> support@aerostic.com</li>
                                            <li><strong>Billing:</strong> billing@aerostic.com</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <h2 className="text-3xl font-bold mb-8 text-gray-900">Send us a Message</h2>
                                
                                {submitted && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 font-semibold">✓ Thank you! Your message has been sent successfully.</p>
                                        <p className="text-green-700 text-sm mt-1">We'll get back to you as soon as possible.</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="+1 (234) 567-890"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Subject *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="sales">Sales Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="billing">Billing Question</option>
                                            <option value="partnership">Partnership Opportunity</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Tell us how we can help..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>

                                    <p className="text-sm text-gray-600">
                                        * Required fields. We'll respond within 24 hours.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">How quickly will I hear back?</h3>
                                <p className="text-gray-600">We aim to respond to all inquiries within 24 hours during business days. Premium support customers receive priority responses.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's your support availability?</h3>
                                <p className="text-gray-600">Our team is available Monday through Friday, 9 AM to 6 PM EST. Enterprise customers have access to 24/7 support.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer phone support?</h3>
                                <p className="text-gray-600">Yes! Enterprise and Premium tier customers can schedule phone calls. Standard users can reach support via email and chat.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I schedule a demo?</h3>
                                <p className="text-gray-600">Absolutely! Select "Sales Inquiry" in our contact form or email sales@aerostic.com to schedule a personalized product demo.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

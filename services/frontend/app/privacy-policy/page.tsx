import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: February 7, 2026</p>
                    <h2>1. Information We Collect</h2>
                    <p>We collect message metadata and phone numbers to bridge WhatsApp with your business tools.</p>
                    <h2>2. Meta Compliance</h2>
                    <p>Data sharing with Meta is governed by the WhatsApp Business Data Processing Terms.</p>
                    <h2>3. Security</h2>
                    <p>We use AES-256 encryption for all sensitive tokens and message content.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

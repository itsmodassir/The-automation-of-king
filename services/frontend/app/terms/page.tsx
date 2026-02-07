import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: February 7, 2026</p>
                    <h2>1. Use of Service</h2>
                    <p>By using Aerostic, you agree to comply with Meta's WhatsApp Business Solution policies.</p>
                    <h2>2. Data Privacy</h2>
                    <p>We process your data according to our Privacy Policy.</p>
                    <h2>3. Termination</h2>
                    <p>We reserve the right to suspend accounts that violate Meta's terms.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

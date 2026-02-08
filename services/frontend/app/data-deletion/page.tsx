
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DataDeletionPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-4xl font-bold mb-8">Data Deletion Instructions</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: February 7, 2026</p>

                    <p>At Aerostic, we respect your privacy and your right to control your data. In accordance with Meta's Platform Terms and GDPR compliance, you may request the deletion of your data from our systems.</p>

                    <h2>How to Request Data Deletion</h2>

                    <h3>Option 1: Automated Deletion (Facebook/Instagram)</h3>
                    <p>If you have connected your Facebook or Instagram account to Aerostic, you can remove the app and request data deletion directly through your Facebook settings:</p>
                    <ol>
                        <li>Go to your Facebook Account <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
                        <li>Look for <strong>Apps and Websites</strong> and find <strong>Aerostic</strong>.</li>
                        <li>Click <strong>Remove</strong>.</li>
                        <li>Select the option to send a <strong>Data Deletion Request</strong> to Aerostic.</li>
                    </ol>

                    <h3>Option 2: Manual Request</h3>
                    <p>You can also request the deletion of your account and all associated data by contacting our support team:</p>
                    <ul>
                        <li><strong>Email:</strong> privacy@aerostic.com</li>
                        <li><strong>Subject:</strong> Data Deletion Request</li>
                    </ul>
                    <p>Please include your account email address and workspace domain in your request. We will process your request within 30 days and confirm deletion via email.</p>

                    <h2>What Data Will Be Deleted?</h2>
                    <p>Upon processing your request, we will permanently delete:</p>
                    <ul>
                        <li>Your user account and profile information.</li>
                        <li>All connected WhatsApp Business API credentials.</li>
                        <li>Message history, contacts, and media stored on our servers.</li>
                        <li>Billing information (subject to tax record retention requirements).</li>
                    </ul>

                    <p>If you have any questions, please contact us at <a href="mailto:privacy@aerostic.com" className="text-blue-600 hover:underline">privacy@aerostic.com</a>.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function Footer() {
    return (
        <footer className="border-t py-10 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Aerostic. All rights reserved.</p>
            <div className="mt-4 space-x-4">
                <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
                <a href="/data-deletion" className="hover:text-blue-600 transition-colors">Data Deletion</a>
                <a href="mailto:support@aerostic.com" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
        </footer>
    );
}

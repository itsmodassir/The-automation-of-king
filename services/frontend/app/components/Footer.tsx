export default function Footer() {
    return (
        <footer className="border-t py-10 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Aerostic. All rights reserved.</p>
            <div className="mt-4 space-x-4">
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms">Terms</a>
                <a href="mailto:support@aerostic.com">Contact</a>
            </div>
        </footer>
    );
}

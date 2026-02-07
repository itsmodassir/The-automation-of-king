export default function Navbar() {
    return (
        <header className="border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold">Aerostic</div>
                <nav className="space-x-6">
                    <a href="#features" className="hover:text-blue-600">Features</a>
                    <a href="#pricing" className="hover:text-blue-600">Pricing</a>
                    <a
                        href="https://app.aerostic.com/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Login
                    </a>
                </nav>
            </div>
        </header>
    );
}

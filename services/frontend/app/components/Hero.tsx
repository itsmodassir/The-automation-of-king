export default function Hero() {
    return (
        <section className="py-24 text-center bg-gray-50">
            <h1 className="text-5xl font-extrabold mb-6">
                Run Your Business on WhatsApp — Smarter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Official WhatsApp Cloud API, AI automation, and team inbox —
                built for real businesses, not hacks.
            </p>

            <div className="flex justify-center gap-4">
                <a
                    href="https://app.aerostic.com/register"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg"
                >
                    Get Started Free
                </a>
                <a
                    href="#how"
                    className="border border-gray-300 px-6 py-3 rounded-xl text-lg"
                >
                    See How It Works
                </a>
            </div>
        </section>
    );
}

const features = [
    {
        title: "Official WhatsApp API",
        desc: "Connect existing WhatsApp numbers using Meta Embedded Signup.",
    },
    {
        title: "AI-Powered Replies",
        desc: "Automatically reply to customers with confidence-based handoff.",
    },
    {
        title: "Team Inbox",
        desc: "Multiple agents, shared conversations, full history.",
    },
    {
        title: "Secure & Compliant",
        desc: "Encrypted tokens, verified webhooks, Meta-approved flow.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
                Everything You Need to Scale on WhatsApp
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((f) => (
                    <div key={f.title} className="p-6 border rounded-xl">
                        <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                        <p className="text-gray-600">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

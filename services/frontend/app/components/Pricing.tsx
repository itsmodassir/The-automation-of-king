export default function Pricing() {
    return (
        <section id="pricing" className="py-20 max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-10">Simple Pricing</h2>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { name: "Starter", price: "₹999", desc: "For small teams" },
                    { name: "Growth", price: "₹2499", desc: "For growing businesses" },
                    { name: "Pro", price: "₹6999", desc: "For automation at scale" },
                ].map((p) => (
                    <div key={p.name} className="border rounded-xl p-8">
                        <h3 className="text-xl font-semibold">{p.name}</h3>
                        <p className="text-4xl font-bold my-4">{p.price}</p>
                        <p className="text-gray-600">{p.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

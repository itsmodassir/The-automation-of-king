export default function HowItWorks() {
    return (
        <section id="how" className="py-20 bg-gray-50 text-center">
            <h2 className="text-3xl font-bold mb-8">How Aerostic Works</h2>
            <p className="max-w-3xl mx-auto text-gray-600 mb-10">
                Messages flow securely through Meta webhooks, automation,
                AI intelligence, and human agents — without breaking WhatsApp rules.
            </p>

            <pre className="bg-white p-6 rounded-xl inline-block text-left text-sm overflow-x-auto max-w-full">
                {`Customer Message
      ↓
Meta Webhook (Verified)
      ↓
Aerostic Engine
  ├─ AI Reply
  ├─ Automation
  └─ Human Agent
      ↓
WhatsApp Delivery`}
            </pre>
        </section>
    );
}

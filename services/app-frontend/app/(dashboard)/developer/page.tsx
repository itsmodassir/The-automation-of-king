"use client";

import { ExternalLink, Webhook, BookOpen, Shield, Code } from "lucide-react";

export default function DeveloperPage() {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Developer Resources</h1>
                <p className="text-gray-400">
                    Access API documentation, webhook guides, and integration tools.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* API Docs Card */}
                <div className="rounded-xl border border-gray-800 bg-gray-950/50 shadow text-white">
                    <div className="p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                API Documentation
                            </h3>
                            <p className="text-sm text-gray-400">
                                Interactive Swagger UI for all API endpoints.
                            </p>
                        </div>
                        <div className="mt-4">
                            <a
                                href="/api/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Open API Docs <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Webhook Config Card */}
                <div className="rounded-xl border border-gray-800 bg-gray-950/50 shadow text-white">
                    <div className="p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                <Webhook className="h-5 w-5" />
                                Webhook Configuration
                            </h3>
                            <p className="text-sm text-gray-400">
                                Guide for setting up WhatsApp Cloud API webhooks.
                            </p>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between items-center bg-gray-900 p-2 rounded">
                                <span className="font-medium text-gray-300">Callback URL:</span>
                                <code className="bg-gray-800 px-1 rounded text-green-400">/api/webhooks/whatsapp</code>
                            </div>
                            <div className="flex justify-between items-center p-2">
                                <span className="font-medium text-gray-300">Verify Token:</span>
                                <span className="text-gray-500">(Check .env)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payload Reference Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-950/50 shadow text-white">
                <div className="p-6">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="font-semibold leading-none tracking-tight">Webhook Payload Reference</h3>
                        <p className="text-sm text-gray-400">
                            Example payload for an incoming text message from WhatsApp.
                        </p>
                    </div>
                    <div className="rounded-md bg-gray-900 p-4 overflow-x-auto border border-gray-800">
                        <pre className="text-xs text-gray-300 font-mono">
                            {`{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "16505551111",
          "phone_number_id": "123456123"
        },
        "messages": [{
          "from": "16315551234",
          "id": "wamid.HBgLM...",
          "timestamp": "1660000000",
          "text": { "body": "Hello world" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Security Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-950/50 shadow text-white">
                <div className="p-6">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security & Verification
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <h4 className="font-medium leading-none text-blue-400">Verification Request (GET)</h4>
                            <p className="text-sm text-gray-400">
                                Meta sends a GET request with <code>hub.mode</code>, <code>hub.verify_token</code>, and <code>hub.challenge</code>.
                                Your server must return the <code>hub.challenge</code> if the token matches.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <h4 className="font-medium leading-none text-blue-400">Signature Validation</h4>
                            <p className="text-sm text-gray-400">
                                Validate the <code>X-Hub-Signature-256</code> header using your App Secret to ensure authenticity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

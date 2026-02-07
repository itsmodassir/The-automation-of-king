import "./globals.css";

export const metadata = {
    title: "Aerostic – Smart WhatsApp Automation Platform",
    description:
        "Aerostic helps businesses automate WhatsApp using the official Meta Cloud API with AI, automation, and team inbox.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-white text-gray-900">{children}</body>
        </html>
    );
}

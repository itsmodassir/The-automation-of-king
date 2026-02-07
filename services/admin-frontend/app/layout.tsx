import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Aerostic Admin',
    description: 'Aerostic Platform Control Tower',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 text-gray-900`}>
                {children}
            </body>
        </html>
    );
}

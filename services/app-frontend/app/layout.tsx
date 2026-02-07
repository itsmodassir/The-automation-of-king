import { Inter } from 'next/font/google';
import { BrandingLoader } from '@/components/branding-loader';
import './globals.css';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <BrandingLoader />
                <BrandingLoader />
                {children}
            </body>
        </html>
    );
}

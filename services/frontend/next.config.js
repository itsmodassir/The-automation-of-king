/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/dashboard/:path*',
                destination: 'https://app.aerostic.com/dashboard/:path*',
                permanent: true,
            },
            {
                source: '/login',
                destination: 'https://app.aerostic.com/login',
                permanent: true,
            },
            {
                source: '/register',
                destination: 'https://app.aerostic.com/register',
                permanent: true,
            },
            {
                source: '/logout',
                destination: 'https://app.aerostic.com/logout',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;

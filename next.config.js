/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@react-pdf/renderer'],
    experimental: {
        turbopack: {
            root: '.',
        },
    },
};

module.exports = nextConfig;

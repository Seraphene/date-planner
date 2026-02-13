/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@react-pdf/renderer'],
    experimental: {
        turbopack: {
            root: __dirname,
        }
    },
};

module.exports = nextConfig;

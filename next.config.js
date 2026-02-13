const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@react-pdf/renderer'],
    turbopack: {
        root: path.resolve(__dirname),
    },
};

module.exports = nextConfig;

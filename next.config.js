/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["cdn.discordapp.com"],
    },
    experimental: {
        images: {
            allowFutureImage: true,
        },
    },
};

module.exports = nextConfig;


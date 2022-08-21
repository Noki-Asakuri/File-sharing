/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: { domains: ["cdn.discordapp.com"] },
    experimental: { images: { allowFutureImage: true } },
};

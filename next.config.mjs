import nextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE ? process.env.ANALYZE.toLowerCase() === "true" : false,
});

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return withBundleAnalyzer(config);
}

export default defineNextConfig({
    swcMinify: true,
    images: { domains: ["cdn.discordapp.com"] },
});

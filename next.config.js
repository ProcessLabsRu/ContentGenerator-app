/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        POCKETBASE_URL: process.env.POCKETBASE_URL,
        DATABASE_PROVIDER: process.env.DATABASE_PROVIDER,
    },
};

module.exports = nextConfig;

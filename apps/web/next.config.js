/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
      },
    ],
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    baseUrl: "https://skippa-service.onrender.com/v1",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/drgtk7a9s/images/upload/**",
      },
    ],
  },
}

module.exports = nextConfig

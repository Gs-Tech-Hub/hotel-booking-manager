/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "ejjqvdxlzztldcqnjrgf.supabase.co",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        port: ""
      },
      {
        protocol: "https",
        hostname: "fmmm1hotel.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: ""
      }
    ]
  }
};

export default nextConfig;

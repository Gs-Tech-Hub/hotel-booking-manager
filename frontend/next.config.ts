import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    // basePath: '/frontend', // Replace with your subdirectory
    // trailingSlash: true,
    images: {
        domains: [
          'i.postimg.cc',
           'ejjqvdxlzztldcqnjrgf.supabase.co',
          "hotel-booking-manager-api.onrender.com"   
       ], // Allow images from these domains
    },
  /* config options here */
};

export default nextConfig;

'use client';

import Navigation from '@/components/Navigation';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';

// Import global styles from /styles/
import '@/styles/bootstrap.min.css';
import '@/styles/font-awesome.min.css';
import '@/styles/style.css';
import '@/styles/responsive.css';
import '@/styles/jquery.mCustomScrollbar.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>F-MMM1 Hotel</title>
        <meta name="description" content="Your hotel booking platform" />
      </head>
      <body className={`${inter.className} main-layout`}>
        {/* Load scripts dynamically */}
        <Script src="/js/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/js/custom-script.js" strategy="lazyOnload" />

        {/* Header */}
        <header>
          <Navigation />
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-300">
                  F-MMM1 Hotel is your ultimate booking platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>
                &copy; {new Date().getFullYear()}  
                <a href="https://gstechhub.com.ng" className="text-gray-300 hover:text-white"> Gs Tech Hub </a>
                All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

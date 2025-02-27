'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
        <Script src="/js/jquery.min.js"  />
        <Script src="/js/bootstrap.bundle.min.js"  />
        <Script src="/js/custom-script.js"  />

        {/* Header */}
        <header>
          <Navigation />
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}

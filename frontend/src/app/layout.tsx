import Navigation from '@/components/Navigation';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'F-MMM1 Hotel',
  description: 'Your hotel booking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`main-layout ${inter.className}`}>
        {/* Loader */}
        <div className="loader_bg">
          <div className="loader">
            <Suspense fallback={<div>Loading...</div>}>
              <Image src="/images/loading.gif" alt="Loading" width={500} height={300} />
            </Suspense>
          </div>
        </div>

        {/* Header */}
        <header>
          <Navigation />
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-300">
                  MyNextApp is a modern web application template built with Next.js.
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
                &copy; {new Date().getFullYear()} . 
                <a href="https://gstechhub.com.ng" className="text-gray-300 hover:text-white"> Gs Tech Hub </a>
                All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Scripts */}
        <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="/js/jquery.mCustomScrollbar.concat.min.js" strategy="lazyOnload" />
        <Script src="/js/custom.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

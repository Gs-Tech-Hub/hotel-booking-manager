'use client'
import Navigation from '@/components/Navigation'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useState, useEffect } from 'react'
// import '/globals.css'

// Import external CSS
import '../../public/css/bootstrap.min.css'; // Bootstrap 4.6.2
import '../../public/css/font-awesome.min.css'; // Font Awesome
import '../../public/css/style.css'; // Custom styles
import '../../public/css/responsive.css'; // Responsive styles
import '../../public/css/jquery.mCustomScrollbar.min.css'; // Custom Scrollbar styles

// Import Bootstrap JavaScript for proper functionality
// import 'jquery/dist/jquery.min.js'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>F-MMM1 Hotel</title>
        <meta name="description" content="Your hotel booking platform" />
      </Head>
      <body className={`${inter.className} main-layout`}>
        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Header */}
        <header>
          <Navigation />
        </header>

        <main className={`${loading ? 'hidden' : 'block'}`}>{children}</main>

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
      </body>
    </html>
  )
}

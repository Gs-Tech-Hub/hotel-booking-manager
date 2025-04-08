'use client';

import { CurrencyProvider } from '@/context/currencyContext';
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
        <Script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js" />
     
        <Script id="tawk-chat-widget" type="text/javascript">
          {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/67f572bf0f0808190514d875/1iobcghg3';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
          `}
        </Script>
        <CurrencyProvider>
        {/* Header */}
        <header>
          <Navigation />
        </header>

        {/* Main Content */}
        <main>{children}</main>
        
        {/* Footer */}
        <Footer />
        </CurrencyProvider>
  
      </body>
    </html>
  );
}

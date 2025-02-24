import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
      <html lang="en">
         <body className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">{children}</main>
            <Footer />
         </body>
      </html>
   );
}

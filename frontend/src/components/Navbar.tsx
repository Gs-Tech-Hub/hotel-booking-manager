"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
   AlignJustify,
   FacebookIcon,
   InstagramIcon,
   MailIcon,
   PhoneIcon,
   TwitterIcon,
   X,
} from "lucide-react";
import Link from "next/link";
import Button from "./ui/button";
import { useState } from "react";

const links = ["Home", "Rooms", "Bookings", "About Us", "Contact"];

export default function Navbar() {
   return (
      <>
         <div className="bg-white text-gray-800 hidden md:block">
            <div className="border-b border-b-gray-300 px-4 xl:px-0">
               <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center">
                     <div className="border-r border-r-gray-300 flex items-center gap-2 py-4 pr-4">
                        <PhoneIcon size={18} className="" />
                        <p className="font-semibold">(12) 345 67890</p>
                     </div>
                     <div className="flex items-center gap-2 p-4">
                        <MailIcon size={18} />
                        <p className="font-semibold">
                           info.hotelbooking@gmail.com
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="social-links flex items-center gap-4">
                        <Link href="#">
                           <FacebookIcon size={18} />
                        </Link>
                        <Link href="#">
                           <TwitterIcon size={18} />
                        </Link>
                        <Link href="#">
                           <InstagramIcon size={18} />
                        </Link>
                     </div>
                     <Button label="BOOKING NOW" isPrimary />
                  </div>
               </div>
            </div>
            <nav className="px-4 xl:px-0">
               <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
                  <Link href="/" className="text-2xl font-bold">
                     FMMM1
                  </Link>
                  <div className="flex items-center gap-6">
                     {links.map((link) => (
                        <Link key={link} href="/" className="font-semibold">
                           {link}
                        </Link>
                     ))}
                     <div className="relative flex items-center">
                        <label className="sr-only">Search</label>
                        <input
                           type="search"
                           placeholder="Search"
                           className="border border-gray-300 px-2 py-1"
                        />
                     </div>
                  </div>
               </div>
            </nav>
         </div>
         <MobileMenu />
      </>
   );
}

function MobileMenu() {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <>
         <nav className="px-4 py-6 flex items-center justify-between md:hidden">
            <Link href="/" className="font-bold text-2xl">
               FMMM1
            </Link>
            <div
               className="border border-gray-200 rounded p-1 cursor-pointer hover:scale-95 transition-all"
               onClick={() => setIsOpen(true)}
            >
               <AlignJustify size={20} />
            </div>
         </nav>
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: isOpen ? "0%" : "-100%" }}
                  exit={{ x: "-100%" }}
                  className="absolute shadow-2xl bg-white h-full md:hidden"
               >
                  <div className="flex flex-col gap-6 p-6 w-[300px]">
                     <button
                        className="rounded-full aspect-square border border-gray-200 p-px w-8 h-8 flex items-center justify-center ml-auto cursor-pointer hover:scale-95 transition-all"
                        onClick={() => setIsOpen(false)}
                     >
                        <X size={18} className="" />
                     </button>
                     <div className="flex items-center justify-center">
                        <label className="sr-only">Search</label>
                        <input
                           type="search"
                           placeholder="Search"
                           className="border border-gray-300 px-2 py-1 w-full"
                        />
                     </div>
                     <Button label="BOOKING NOW" isPrimary className="" />
                     <div className="w-full flex flex-col gap-4">
                        {links.map((link) => (
                           <div key={link} className="flex flex-col gap-2">
                              <Link
                                 key={link}
                                 href="/"
                                 className="font-semibold"
                              >
                                 {link}
                              </Link>
                              <div className="aspect-square border border-gray-100 w-full h-px" />
                           </div>
                        ))}
                     </div>
                     <div className="flex items-center justify-center gap-6 mt-5">
                        <Link href="#">
                           <FacebookIcon size={18} />
                        </Link>
                        <Link href="#">
                           <TwitterIcon size={18} />
                        </Link>
                        <Link href="#">
                           <InstagramIcon size={18} />
                        </Link>
                     </div>

                     <div className="flex items-center flex-col gap-px">
                        <div className="flex items-center gap-2">
                           <PhoneIcon size={16} className="" />
                           <p className="font-semibold">(12) 345 67890</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <MailIcon size={16} />
                           <p className="font-semibold">
                              info.hotelbooking@gmail.com
                           </p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}

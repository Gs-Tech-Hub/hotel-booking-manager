import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';


import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { getOrganisationInfo } from "@/lib/getOrganisationInfo";



export async function generateMetadata() {
  const organisation = await getOrganisationInfo();
  return {
    title: {
      template: `${organisation.organisation.name} Admin`,
      default: `${organisation.organisation.name} - Dashboard`,
    },
    description: "Admin Dashboard",
  };
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
              <ToastContainer position="top-right" autoClose={3000} />
              <main>
                {children}
              </main>
        </Providers>
      </body>
    </html>
  );
}

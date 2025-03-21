"use client";
// import { usePaystackPayment } from "react-paystack";

// interface PaystackConfig {
//   email: string;
//   amount: number;
//   publicKey: string;
// }

// export const usePaystackPaymentHook = (config: PaystackConfig) => {
//   const initializePayment = usePaystackPayment(config); // ✅ Hook now called at top level

//   const handlePayment = (onSuccess?: (response: any) => void, onClose?: () => void) => {
//     if (typeof window !== "undefined") {
//       alert("Payments are only available in the browser.");
//       return;
//     }
//     initializePayment({ onSuccess, onClose });
//   };

//   return { handlePayment };
// };

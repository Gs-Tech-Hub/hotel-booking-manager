"use client";
import dynamic from "next/dynamic";
import { useBookingStore } from "../../store/bookingStore";

// Dynamically import PaystackButton to prevent SSR issues
const PaystackButton = dynamic(() => import("react-paystack").then(mod => mod.PaystackButton), { ssr: false });

function CheckoutPage() {
  const { selectedRoom, extras, guestInfo, nights } = useBookingStore();

  const vatRate = 0.1;
  const roomTotal = selectedRoom ? nights * selectedRoom.priceOnline : 0;
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const vatAmount = (roomTotal + extrasTotal) * vatRate;
  const grandTotal = roomTotal + extrasTotal + vatAmount;

  const paystackConfig = {
    email: guestInfo?.email || "",
    amount: selectedRoom ? grandTotal * 100 : 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    text: "Pay Now",
    onSuccess: (response: any) => {
      console.log("Payment successful:", response);
      alert("Payment successful! Reference: " + response.reference);
      // Navigate to confirmation page (Optional)
    },
    onClose: () => {
      alert("Payment was not completed.");
    },
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p><strong>Total Amount:</strong> ${grandTotal.toFixed(2)}</p>
      
      {/* Render Paystack Button only on the client */}
      {typeof window !== "undefined" && <PaystackButton className="book-btn mt-4" {...paystackConfig} />}
    </div>
  );
}

export default CheckoutPage;

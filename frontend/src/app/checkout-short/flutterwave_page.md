"use client";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useState, useEffect } from "react";
import { strapiService } from "../../utils/strapi";
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';

interface FlutterwaveResponse {
  transaction_id: number;
  status: string;
  amount: number;
  
}

const VAT_RATE = 7.5; // VAT percentage


function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  if (typeof date === "string") return new Date(date).toLocaleDateString();
  return date.toLocaleDateString();
}

function CheckoutPage() {
  const router = useRouter();
  const {
      paymentMethod,
      stayDate,
      stayStartTime,
      stayEndTime,
      stayPrice, 
      totalPrice,
      extras,
      guestInfo,
      selectedMenus,
    updateBooking,
  } = useBookingStore();

  const [showIncompleteError, setShowIncompleteError] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [extrasTotal, setExtrasTotal] = useState(0);
  const { currency } = useCurrency();


  useEffect(() => {
    const roomTotal = stayPrice;
    const menuTotal = selectedMenus.reduce((sum, { item }) => sum + item.price, 0);
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0) + menuTotal;
    const vatAmount = (roomTotal + extrasTotal) * 0.1;
    const grandTotal = roomTotal + extrasTotal + vatAmount;

    setExtrasTotal(extrasTotal);
    setVatAmount(vatAmount);
    setFinalTotal(grandTotal);
    updateBooking({ totalPrice: grandTotal });
  }, [extras, stayPrice]);

  const handlePaymentCallback = async (response: FlutterwaveResponse) => {
    const store = useBookingStore.getState();
    const transactionData = {
      PaymentStatus: response.status,
      totalPrice: response.amount || store.totalPrice,
      transactionID: String(response.transaction_id),
      paymentMethod: store.paymentMethod,
    };

    const paymentId = await strapiService.createTransaction(transactionData);
    const customerId = await strapiService.createOrGetCustomer(guestInfo);
    if (!customerId || !paymentId) {
      alert("Error processing payment.");
      return;
    }

    const createdBookingId = await strapiService.createOrGetBooking({
      totalPrice,
      customer: customerId,
      payment: paymentId,
    });
    
    updateBooking({ bookingId: createdBookingId });
    
    router.push(
      `/booking-confirmation?bookingId=${createdBookingId}&reference=${response.transaction_id}&email=${guestInfo.email}&amount=${store.totalPrice}&checkIn=${formatDate(stayDate)}`
    );
    closePaymentModal();
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `BOOKING_${Date.now()}`,
    amount: totalPrice,
    currency: "NGN",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: guestInfo.email || "",
      phone_number: guestInfo.phone || "",
      name: `${guestInfo.FirstName} ${guestInfo.lastName}`,
    },
    customizations: {
      title: "FMMM1 Hotel",
      description: "Payment for hotel room reservation",
      logo: "https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png/50",
    },
    callback: handlePaymentCallback,
    onClose: () => alert("Payment was not completed."),
  };

  const initializePayment = useFlutterwave(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({
      guestInfo: { ...guestInfo, [e.target.name]: e.target.value },
    });
  };

  const handleConfirmBooking = async () => {
    if (!guestInfo.FirstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setShowIncompleteError(true);
      return;
    }
    setShowIncompleteError(false);

    if (paymentMethod === "online") {
      initializePayment({ callback: handlePaymentCallback, onClose: config.onClose });
    } else {
      const customerId = await strapiService.createOrGetCustomer(guestInfo);
      if (!customerId) {
        alert("Error: Could not create or retrieve customer.");
        return;
      }
      const createdBookingId = await strapiService.createOrGetBooking({
        totalPrice,
        customer: customerId,
      });
      updateBooking({ bookingId: createdBookingId });
      
      router.push(
        `/booking-confirmation?bookingId=${createdBookingId}&email=${guestInfo.email}&amount=${totalPrice}&checkIn=${formatDate(stayDate)}`
      );
    }
  };

 

  return (
    <div className="our_room">
        <div className="booking-container">
        <h2 className="booking-header text-center">Checkout Summary</h2>
        <div className="short-stay-summary border p-4 rounded mb-4">
          <h5>Short Stay Details</h5>
          <p><strong>Date:</strong> {stayDate}</p>
          <p><strong>Time:</strong> {stayStartTime} - {stayEndTime}</p>
            <p><strong>Extra Services:</strong> {formatPrice( extrasTotal, currency)}</p>
            <p><strong>VAT ({VAT_RATE}%):</strong> { formatPrice(vatAmount, currency)}</p>          <p><strong>Total Price:</strong> {formatPrice(finalTotal, currency)}</p>
        </div>
    
      {extras && extras.length > 0 && (
        <>
          <p><strong>Extras:</strong></p>
          <ul>
            {extras.map((extra, i) => (
              <li key={i}>{extra.name} - {formatPrice(extra.price, currency)}</li>
            ))}
          </ul>
        </>
      )}

      {selectedMenus && selectedMenus.length > 0 && (
        <div className="menu-summary border p-4 rounded mb-4">
          <h5>Selected Menu Items</h5>
          <ul>
            {selectedMenus.map(({item, menuType}, i) => (
                <li key={i}>
                {menuType} - {formatPrice(item.price, currency)}
              </li>
            ))}
          </ul>
        </div>
      )}

<div className="form-container">
            <h2 className="room-name">Guest Information</h2>
            <form className="guest-form">
              <label>First Name:</label>
              <input type="text" name="FirstName" value={guestInfo.FirstName || ""} onChange={handleChange} required />

              <label>Last Name:</label>
              <input type="text" name="lastName" value={guestInfo.lastName || ""} onChange={handleChange} required />

              <label>Email:</label>
              <input type="email" name="email" value={guestInfo.email || ""} onChange={handleChange} required />

              <label>Phone:</label>
              <input type="text" name="phone" value={guestInfo.phone || ""} onChange={handleChange} required />
            </form>

            <button className="book-btn mt-4" onClick={handleConfirmBooking}>
              {paymentMethod === "online" ? "Confirm Payment" : "Confirm Booking"}
            </button>

            {showIncompleteError && (
              <p className="text-red-500 mt-2">Please fill in all guest information before proceeding.</p>
            )}

            <p className="mt-4 text-sm">
              By submitting this form you accept our <a href="/policies" className="text-blue-600 hover:underline">terms and conditions and policies</a>
            </p>
            </div>   
        </div>
    </div>
  );
};

export default CheckoutPage;
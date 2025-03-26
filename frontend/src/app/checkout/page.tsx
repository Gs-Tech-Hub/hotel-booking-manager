// /components/CheckoutPage.tsx
"use client";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getOrCreateCustomer, createBookingIfNotExists } from "../../utils/strapi";

interface FlutterwaveResponse {
  transaction_id: number;
  status: string;
}

function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  if (typeof date === "string") return new Date(date).toLocaleDateString();
  return date.toLocaleDateString();
}

function CheckoutPage() {
  const router = useRouter();
  const {
    checkIn,
    checkOut,
    guests,
    selectedRoom,
    extras,
    guestInfo,
    nights,
    updateBooking,
    paymentMethod,
    totalPrice,
    bookingId,
  } = useBookingStore();

  const [showIncompleteError, setShowIncompleteError] = useState(false);

  useEffect(() => {
    // Calculate totalPrice on mount or changes
    const roomTotal = selectedRoom ? nights * (selectedRoom.priceOnline || 0) : 0;
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
    const vatAmount = (roomTotal + extrasTotal) * 0.1;
    const grandTotal = roomTotal + extrasTotal + vatAmount;
    updateBooking({ totalPrice: grandTotal });
  }, [selectedRoom, nights, extras]);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `BOOKING_${Date.now()}`,
    amount: totalPrice,
    currency: "NGN",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: guestInfo.email || "",
      phone_number: guestInfo.phone || "",
      name: `${guestInfo.firstName} ${guestInfo.lastName}`,
    },
    customizations: {
      title: "FMMM1 Hotel",
      description: "Payment for hotel room reservation",
      logo: "https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png/50",
    },
    callback: async (response: FlutterwaveResponse) => {
      const store = useBookingStore.getState();

      await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: response.transaction_id,
          status: response.status,
          amount: store.totalPrice,
          email: guestInfo.email,
          bookingId: store.bookingId,
          bookingStore: store,
        }),
      });

      router.push(
        `/booking-confirmation?bookingId=${store.bookingId}&reference=${response.transaction_id}&email=${guestInfo.email}&amount=${store.totalPrice}&checkIn=${formatDate(checkIn)}&checkOut=${formatDate(checkOut)}&guests=${guests}&room=${selectedRoom?.title}&roomImage=${selectedRoom?.imgUrl}`
      );
      closePaymentModal();
    },
    onClose: () => {
      alert("Payment was not completed.");
    },
  };

  const initializePayment = useFlutterwave(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({
      guestInfo: { ...guestInfo, [e.target.name]: e.target.value },
    });
  };

  const handleConfirmBooking = async () => {
    const isGuestInfoComplete =
      guestInfo.firstName && guestInfo.lastName && guestInfo.email && guestInfo.phone;

    if (!isGuestInfoComplete) {
      setShowIncompleteError(true);
      return;
    }

    setShowIncompleteError(false);

    const customerId = await getOrCreateCustomer(guestInfo);
    updateBooking({ customerId });

    const createdBookingId = await createBookingIfNotExists({
      ...useBookingStore.getState(),
      customerId,
    });
    updateBooking({ bookingId: createdBookingId });

    if (paymentMethod === "online") {
      initializePayment({ callback: config.callback, onClose: config.onClose });
    } else {
      router.push(
        `/booking-confirmation?bookingId=${createdBookingId}&email=${guestInfo.email}&amount=${totalPrice}&checkIn=${formatDate(checkIn)}&checkOut=${formatDate(checkOut)}&guests=${guests}&room=${selectedRoom?.title}&roomImage=${selectedRoom?.imgUrl}`
      );
    }
  };

  if (!selectedRoom || !guestInfo) {
    return <h2 className="text-center">No booking selected. Please return to the booking page.</h2>;
  }

  return (
    <div className="our_room">
      <div className="booking-container">
        <h1 className="booking-header text-center">Checkout</h1>
        <div className="checkout-layout">
          <div className="room-card">
            <div className="room-info">
              {selectedRoom.imgUrl && (
                <Image
                  src={selectedRoom.imgUrl}
                  alt={selectedRoom.title}
                  width={350}
                  height={200}
                  className="rounded-lg"
                />
              )}
              <div className="room-details">
                <h2 className="room-name">{selectedRoom.title}</h2>
                <p><strong>Nights:</strong> {nights}</p>
                <p><strong>Check-in:</strong> {formatDate(checkIn)}</p>
                <p><strong>Check-out:</strong> {formatDate(checkOut)}</p>
                <p><strong>Occupancy:</strong> {guests} {guests > 1 ? "guests" : "guest"}</p>
                <p className="price price-online"><strong>Price per Night:</strong> ${selectedRoom.priceOnline.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="price-summary">
            <h2 className="room-name">Price Summary</h2>
            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          </div>

          <div className="form-container">
            <h2 className="room-name">Guest Information</h2>
            <form className="guest-form">
              <label>First Name:</label>
              <input type="text" name="firstName" value={guestInfo.firstName || ""} onChange={handleChange} required />

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

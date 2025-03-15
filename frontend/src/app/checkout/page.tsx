"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { usePaystackPayment } from "react-paystack";
import Image from "next/image";

function CheckoutPage() {
  const router = useRouter();
  const { checkIn, checkOut, guests, selectedRoom, extras, guestInfo, nights, updateBooking } = useBookingStore();

  if (!selectedRoom) {
    return <h2 className="text-center">No booking selected. Please return to the booking page.</h2>;
  }

  // Calculate costs
  const vatRate = 0.1;
  const roomTotal = nights * selectedRoom.priceOnline;
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const vatAmount = (roomTotal + extrasTotal) * vatRate;
  const grandTotal = roomTotal + extrasTotal + vatAmount;

  // Handle input change for guest details
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } });
  };

  // Paystack Configuration
  const [paystackConfig, setPaystackConfig] = useState({
    reference: `BOOKING_${Date.now()}`,
    email: guestInfo.email || "",
    amount: grandTotal * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  });

  useEffect(() => {
    setPaystackConfig({
      reference: `BOOKING_${Date.now()}`,
      email: guestInfo.email || "",
      amount: grandTotal * 100, // Convert to kobo
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    });
  }, [guestInfo.email, grandTotal]);

  const onSuccess = (response: any) => {
    console.log("Payment successful:", response);
  
    // Extract payment details directly from Paystack response
    const bookingId = `BOOKING_${response.reference}`;
    const reference = response.reference;
    const email = guestInfo.email;
    const amount = grandTotal * 100; // Convert to kobo
    const checkInDate = checkIn ? checkIn.toLocaleDateString() : "N/A";
    const checkOutDate = checkOut ? checkOut.toLocaleDateString() : "N/A";
    const guestsCount = guests;
    const roomName = selectedRoom.name;
    const roomImage = selectedRoom.image;
  
    // Redirect to the Confirmation Page with Payment Details
    router.push(
      `/booking-confirmation?bookingId=${bookingId}&reference=${reference}&email=${email}&amount=${amount}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestsCount}&room=${roomName}&roomImage=${roomImage}`
    );
  };
  
  const onClose = () => {
    alert("Payment was not completed.");
  };
  
  const initializePayment = usePaystackPayment(paystackConfig);
  
  return (
    <div className="booking-container">
      <h1 className="booking-header text-center">Checkout</h1>
      <div className="checkout-layout">
        {/* Room Summary */}
        <div className="room-card">
            <div className="room-info">
            <Image 
              src={selectedRoom.image} 
              alt={selectedRoom.name} 
              width={350} 
              height={200}
              className="rounded-lg"
            />
            <div className="room-details">
              <h2 className="room-name">{selectedRoom.name}</h2>
              <p><strong>Nights:</strong> {nights}</p>
              <p><strong>Check-in:</strong> {checkIn ? checkIn.toLocaleDateString() : "N/A"}</p>
              <p><strong>Check-out:</strong> {checkOut ? checkOut.toLocaleDateString() : "N/A"}</p>
              <p><strong>Occupancy:</strong> {guests} {guests > 1 ? "guests" : "guest"}</p>
              <p className="price price-online"><strong>Price per Night:</strong> ${selectedRoom.priceOnline.toFixed(2)}</p>
            </div>
            </div>
        </div>

        {/* Price Summary */}
        <div className="price-summary">
          <h2 className="room-name">Price Summary</h2>
          <p><strong>Room Total:</strong> ${roomTotal.toFixed(2)}</p>
          <p><strong>Extras Total:</strong> ${extrasTotal.toFixed(2)}</p>
          <p><strong>VAT ({(vatRate * 100).toFixed(0)}%):</strong> ${vatAmount.toFixed(2)}</p>
          <p className="total-price"><strong>Grand Total:</strong> ${grandTotal.toFixed(2)}</p>
        </div>

        {/* Guest Information Form */}
        <div className="form-container">
          <h2 className="room-name">Guest Information</h2>
          <form className="guest-form">
            <label>First Name:</label>
            <input type="text" name="firstName" value={guestInfo.firstName} onChange={handleChange} required />

            <label>Last Name:</label>
            <input type="text" name="lastName" value={guestInfo.lastName} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={guestInfo.email} onChange={handleChange} required />

            <label>Phone:</label>
            <input type="text" name="phone" value={guestInfo.phone} onChange={handleChange} required />
          </form>

          {/* Paystack Payment Button */}
          <button className="book-btn mt-4" onClick={() => initializePayment({ onSuccess, onClose })}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

"use client";

import { useState } from "react";
import { useBookingStore } from "../../store/bookingStore";

function CheckoutPage() {
  const { checkIn, checkOut, guests, selectedRoom, extras, guestInfo, nights, updateBooking } = useBookingStore();

  if (!selectedRoom) {
    return <h2 className="text-center">No booking selected. Please return to the booking page.</h2>;
  }

  // Calculate costs
  const vatRate = 0.1;
  const roomTotal = selectedRoom ? nights * selectedRoom.priceOnline : 0;
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const vatAmount = (roomTotal + extrasTotal) * vatRate;
  const grandTotal = roomTotal + extrasTotal + vatAmount;

  // Handle input change for guest details
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } });
  };

  return (
    <div className="booking-container">
      <h1 className="booking-header text-center">Checkout</h1>
      <div className="checkout-layout">
        {/* Room Summary */}
        <div className="room-card">
          <div className="room-info">
            <img src={selectedRoom.image} alt={selectedRoom.name} className="rounded-lg" width={350} height={200} />
            <div className="room-details">
              <h2 className="room-name">{selectedRoom.name}</h2>
              <p><strong>Nights:</strong> {nights}</p> {/* FIX: Uses Zustand's `nights` */}
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
          <button className="book-btn mt-4">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

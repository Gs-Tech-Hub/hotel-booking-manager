"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";

function BookingSummaryContent() {
  const router = useRouter();
  const {
    checkIn,
    checkOut,
    guests,
    selectedRoom,
    paymentMethod,
    extras,
    totalPrice,
    updateBooking,
  } = useBookingStore();

  const [selectedExtras, setSelectedExtras] = useState<string[]>((extras || []).map(extra => extra.name));

  // Handle case where no room is selected
  if (!selectedRoom) {
    return <h2 className="text-center">No booking details found.</h2>;
  }

  // Extra services list
  const availableExtras = [
    { name: "Breakfast", price: 4000 },
    { name: "Lunch", price: 4000 },
    { name: "Dinner", price: 4500 },
    { name: "Laundry Service", price: 3000 },
    { name: "Spa", price: 2500 },
  ];

  // Toggle extra selection
  const toggleExtra = (extra: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((item) => item !== extra) : [...prev, extra]
    );
  };

  // Calculate totals
  const extraTotal = availableExtras.reduce(
    (sum, extra) => (selectedExtras.includes(extra.name) ? sum + extra.price : sum),
    0
  );
  const grandTotal = totalPrice + extraTotal;

  // Proceed to checkout
  const handleCheckout = () => {
    const selectedExtrasWithPrices = availableExtras.filter(extra => 
      selectedExtras.includes(extra.name)
    );
    updateBooking({
      extras: selectedExtrasWithPrices,
      totalPrice: grandTotal,
    });
    router.push("/checkout");
  };

  return (
    <div className="our_room">
 <div className="booking-container">
      <h1 className="booking-header text-center">
        Booking Summary for{" "}
        <span className="highlight-text">
          {selectedRoom && selectedRoom.title}
        </span>
      </h1>

      <div className="room-card mt-4">
        <div className="room-info">
          {selectedRoom.imgUrl && (
            <Image
              src={selectedRoom.imgUrl}
              width={350}
              height={200}
              className="rounded-lg"
              alt={selectedRoom.title}
            />
          )}
          <div className="room-details">
            <h2 className="room-name">{selectedRoom.title}</h2>
            <p className="price price-online">
              Room Price: ₦ {totalPrice.toFixed(2)}
            </p>
            <p className="payment-method">
              <strong>Payment Method:</strong> {paymentMethod === "online" ? "Pay Online" : "Pay at Hotel"}
            </p>
          </div>
        </div>
      </div>

      <div className="room-card mt-4">
        <h2 className="room-name">Stay Details</h2>
        <p>
          <strong>Check-in:</strong> {checkIn ? checkIn.toLocaleDateString() : "N/A"}
        </p>
        <p>
          <strong>Check-out:</strong> {checkOut ? checkOut.toLocaleDateString() : "N/A"}
        </p>
        <p>
          <strong>Guests:</strong> {guests}
        </p>
      </div>

      <div className="room-card mt-4">
        <h2 className="room-name">Extra Services</h2>
        <div className="extra-options-grid">
          {availableExtras.map((extra) => (
            <label key={extra.name} className="extra-option">
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.name)}
                onChange={() => toggleExtra(extra.name)}
              />
              <span className="extra-name">{extra.name}</span>
              <span className="extra-price">₦{extra.price}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="room-card mt-4">
        <h2 className="room-name">Total Cost</h2>
        <p>
          <strong>Room Price:</strong> ₦{totalPrice.toFixed(2)}
        </p>
        <p>
          <strong>Extras Total:</strong> ₦{extraTotal.toFixed(2)}
        </p>
        <p className="total-price">
          <strong>Grand Total:</strong> ₦{grandTotal.toFixed(2)}
        </p>
      </div>

      <button className="book-btn mt-4" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
    </div>
    </div>
  
  );
}

export default function BookingSummary() {
  return (
    <Suspense fallback={<h2 className="text-center">Loading booking details...</h2>}>
      <BookingSummaryContent />
    </Suspense>
  );
}

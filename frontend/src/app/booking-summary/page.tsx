"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";

interface BookingDetails {
  name: string;
  image: string;
  amenities: string[];
  nights: number;
  priceOnline: number;
}

function BookingSummaryContent() {
  const searchParams = useSearchParams();
  const { checkIn, checkOut, guests } = useBookingStore();

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const image = searchParams.get("image") || "";
    const amenities = searchParams.get("amenities") ? searchParams.get("amenities")!.split(", ") : [];
    const nights = searchParams.get("nights") ? parseInt(searchParams.get("nights")!) : 1;
    const priceOnline = searchParams.get("priceOnline") ? parseFloat(searchParams.get("priceOnline")!) : 0;

    setBookingDetails({ name, image, amenities, nights, priceOnline });
  }, [searchParams]);

  if (!bookingDetails) {
    return <h2 className="text-center">Loading booking details...</h2>; // ✅ Prevents rendering before state updates
  }

  return (
    <div className="booking-container">
      <h1 className="booking-header">Booking Summary</h1>
      <h3 className="text-center text-lg font-bold mt-4">
        You are booking for {bookingDetails.nights} night{bookingDetails.nights > 1 ? "s" : ""}
      </h3>
      <div className="room-card">
        <div className="room-info">
          {bookingDetails.image && (
            <Image
              src={bookingDetails.image}
              width={350}
              height={200}
              className="rounded-lg"
              alt={bookingDetails.name}
            />
          )}
          <div className="room-details">
            <h2 className="room-name">{bookingDetails.name}</h2>
            <p className="room-availability">
              Amenities: {bookingDetails.amenities.length ? bookingDetails.amenities.join(", ") : "N/A"}
            </p>
            <p className="price price-online">Total Price: ${bookingDetails.priceOnline}</p>
          </div>
        </div>
      </div>

      {/* ✅ Display check-in, check-out, and guests */}
      <div className="text-center mt-4">
        <p><strong>Check-in:</strong> {checkIn ? checkIn.toLocaleDateString() : "N/A"}</p>
        <p><strong>Check-out:</strong> {checkOut ? checkOut.toLocaleDateString() : "N/A"}</p>
        <p><strong>Guests:</strong> {guests}</p>
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

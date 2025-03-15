"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

const BookingConfirmation = () => {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const reference = searchParams.get("reference");
  const email = searchParams.get("email");
  const amount = searchParams.get("amount");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const room = searchParams.get("room");
  const roomImage = searchParams.get("roomImage"); // Room banner image

  return (
    <div className="booking-container">
      <h1 className="booking-header text-center">Booking Confirmed!</h1>

      {/* Room Banner with Next.js Image */}
      {roomImage && (
        <div className="flex flex-col items-center justify-center mx-auto">
          <Image src={roomImage} width={300} height={300} alt={room || 'Room image'} className="rounded-lg" />
        <h2>Booking Receipt</h2>
        <p><strong>Booking ID:</strong> {bookingId}</p>
        <p><strong>Reference:</strong> {reference}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Amount Paid:</strong> ₦{(Number(amount) / 100).toFixed(2)}</p>
        <p><strong>Check-in:</strong> {checkIn}</p>
        <p><strong>Check-out:</strong> {checkOut}</p>
        <p><strong>Guests:</strong> {guests}</p>
        <p><strong>Room:</strong> {room}</p>
        </div>
      )}
      <button onClick={() => window.print()} className="book-btn mt-4">Print Receipt</button>
    </div>
  );
};

export default BookingConfirmation;

"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

const BookingConfirmationContent = () => {
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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="booking-container bg-gray-100 p-6 rounded-lg shadow-xl text-center">
        <h1 className="booking-header text-3xl font-bold mb-4">Booking Confirmed!</h1>
  
        {roomImage && (
          <div className="flex flex-col items-center">
            <Image src={roomImage} width={500} height={300} alt={room || 'Room image'} className="rounded-lg mb-4" />
            <h2 className="text-xl font-semibold mb-2">Booking Receipt</h2>
            <p><strong>Booking ID:</strong> {bookingId}</p>
            <p><strong>Reference:</strong> {reference}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Amount Paid:</strong> ₦{(Number(amount)).toFixed(2)}</p>
            <p><strong>Check-in:</strong> {checkIn}</p>
            <p><strong>Check-out:</strong> {checkOut}</p>
            <p><strong>Guests:</strong> {guests}</p>
            <p><strong>Room:</strong> {room}</p>
          </div>
        )}
        <button onClick={() => window.print()} className="book-btn mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Print Receipt
        </button>
      </div>
    </div>
  );  
};

const BookingConfirmation = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BookingConfirmationContent />
  </Suspense>
);

export default BookingConfirmation;

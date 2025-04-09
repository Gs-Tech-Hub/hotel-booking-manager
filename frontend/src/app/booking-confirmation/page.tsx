"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useRef } from "react";

const BookingConfirmationContent = () => {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const bookingId = searchParams.get("bookingId");
  const reference = searchParams.get("reference");
  const email = searchParams.get("email");
  const amount = searchParams.get("amount");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const room = searchParams.get("room");
  const roomImage = searchParams.get("roomImage");

  const hasHotelDetails = room && roomImage;

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    if (contentRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `booking_receipt_${bookingId}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(contentRef.current)
        .save();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        ref={contentRef}
        className="booking-container bg-gray-100 p-6 rounded-lg shadow-xl text-center max-w-xl w-full"
      >
        <h1 className="booking-header text-3xl font-bold mb-4">Booking Confirmed!</h1>

        {hasHotelDetails ? (
          <div className="flex flex-col items-center">
            <Image
              src={roomImage!}
              width={500}
              height={300}
              alt={room || "Room image"}
              className="rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">Hotel Booking Receipt</h2>
            <p><strong>Room:</strong> {room}</p>
            <p><strong>Guests:</strong> {guests}</p>
            <p><strong>Check-in:</strong> {checkIn}</p>
            <p><strong>Check-out:</strong> {checkOut}</p>
          </div>
        ) : (
          <div className="text-left">
            <p className="text-lg mb-4">Your booking has been successfully completed.</p>
            <p>Please Show your Receipt at the reception.</p>
          </div>
        )}

        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Reference:</strong> {reference}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Check-in:</strong> {checkIn}</p>
          <p><strong>Amount Paid:</strong> ₦{Number(amount || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={handleDownloadPDF}
          className="book-btn mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download PDF Receipt
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

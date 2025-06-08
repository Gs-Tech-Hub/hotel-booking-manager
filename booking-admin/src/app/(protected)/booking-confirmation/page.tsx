"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useRef } from "react";
import {formatPrice} from "@/utils/priceHandler";

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
      <div className="booking-container bg-white p-6 rounded-lg shadow-xl text-center max-w-xl w-full">
        <div ref={contentRef} className="text-black">
          {/* Hotel Logo and Name */}
          <div className="mb-4">
            <Image
              src="https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png"
              width={100}
              height={100}
              alt="FMMM1 Hotel Logo"
              sizes="100px"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />      
            <h1 className="text-2xl font-bold">FMMM1 Hotel</h1>
            <p className="text-sm text-gray-600">https://f-mmm1-hotel.nl</p>
          </div>

          <h1 className="booking-header text-3xl font-bold mb-4">Booking Confirmed!</h1>

          {hasHotelDetails ? (
            <div className="flex justify-between items-center">
              <div>
              <Image
                src={roomImage!}
                width={300}
                height={200}
                alt={room || "Room image"}
                className="rounded-lg mb-4"
                sizes="300px"
                style={{ width: '300px', height: '200px', objectFit: 'cover' }}
              />
              </div>
              <div>
              <h3 className="text-lg font-semibold mb-2">Hotel Booking Receipt</h3>             
              <p><strong>Booking ID:</strong> {bookingId}</p>
              <p><strong>Reference:</strong> {reference}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Room:</strong> {room}</p>
              <p><strong>Guests:</strong> {guests}</p>
              <p><strong>Check-in:</strong> {checkIn}</p>
              <p><strong>Check-out:</strong> {checkOut}</p>
              <h3 className="mt-4">
                <strong>Amount Paid:</strong> {formatPrice(parseFloat(amount!), "NGN")}  
              </h3>
              </div>   
            </div>
          ) : (
            <div className="flex flex-col items-center">
            <p className="text-lg mb-4">Your booking has been successfully completed.</p>
        
            {bookingId && <p><strong>Booking ID:</strong> {bookingId}</p>}
            {reference && <p><strong>Reference:</strong> {reference}</p>}
            {email && <p><strong>Email:</strong> {email}</p>}
            {checkIn && <p><strong>Check-in:</strong> {checkIn}</p>}
            {checkOut && <p><strong>Check-Out:</strong>{checkOut}</p>}
            {room && <p><strong>Room:</strong>{room}</p>}
            {amount && (
              <h3 className="mt-4">
                <strong>Amount Paid:</strong> {formatPrice(parseFloat(amount!), "NGN")}  
              </h3>
            )}
          </div>
        )}

          {/* Website footer for branding */}
          <div className="mt-6 border-t pt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} FMMM1 Hotel. All rights reserved.
            <br />
            Visit us at: <span className="text-blue-600">https://fmmm1hotel.com</span>
            <br />
            Address: <span className="text-gray-500">FMMM1 CLOSE, off Board Road, Alihame, Agbor. Delta State. Nigeria</span>
            <br />
            Email: <span className="text-gray-500">fmmmhotels@gmail.com</span>
            <br /> 
            Phone: <span className="text-blue-600">0704 523 2697</span>
            
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="book-btn mt-8"
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
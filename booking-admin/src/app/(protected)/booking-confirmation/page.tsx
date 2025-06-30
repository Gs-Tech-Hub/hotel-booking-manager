"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useRef } from "react";
import {formatPrice} from "@/utils/deprecated/priceHandler";
import axios from "axios";
import { useOrganisationInfo } from "@/hooks/useOrganisationInfo";

const BookingConfirmationContent = () => {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const { organisation } = useOrganisationInfo();

  const bookingId = searchParams.get("bookingId");
  const reference = searchParams.get("reference");
  const email = searchParams.get("customerEmail");
  const phone = searchParams.get("customerPhone");
  const amount = searchParams.get("amount");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const room = searchParams.get("room");
  const roomImage = searchParams.get("roomImage");
  const customerName = searchParams.get("customerName");

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

  const handleSendPDFToEmail = async () => {
    if (!email) {
      alert("No email found for this booking.");
      return;
    }
    const html2pdf = (await import("html2pdf.js")).default;
    if (contentRef.current) {
      const opt = {
        margin: 0.5,
        filename: `booking_receipt_${bookingId}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      const worker = html2pdf().set(opt).from(contentRef.current);
      const pdfBlob: Blob = await worker.outputPdf('blob');
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", "Your Booking Confirmation - FMMM1 Hotel");
      formData.append("pdf", pdfBlob, `booking_receipt_${bookingId}.pdf`);
      try {
        await axios.post("/api/send-booking-confirmation", formData);
        alert("Confirmation PDF sent to your email!");
      } catch (err) {
        alert(`Failed to send email. Please try again later.; ${err}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="booking-container bg-white p-6 rounded-lg shadow-xl text-center max-w-xl w-full">
        <div ref={contentRef} className="text-black">
          {/* Hotel Logo and Name */}
          <div className="mb-4">
            <Image
              src={organisation.logo?.light || "https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png"}
              width={100}
              height={100}
              alt={organisation.name + " Logo"}
              sizes="100px"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />      
            <h1 className="text-2xl font-bold">{organisation.name}</h1>
            <p className="text-sm text-gray-600">{organisation.website}</p>
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
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Phone:</strong> {phone}</p>
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
            {customerName && <p><strong>Customer:</strong> {customerName}</p>}
            {phone && <p><strong>Phone:</strong> {phone}</p>}
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
            © {new Date().getFullYear()} {organisation.name}. All rights reserved.
            <br />
            Visit us at: <span className="text-blue-600">{organisation.website}</span>
            <br />
            Address: <span className="text-gray-500">{organisation.address}</span>
            <br />
            Email: <span className="text-gray-500">{organisation.email}</span>
            <br /> 
            Phone: <span className="text-blue-600">{organisation.phone}</span>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="book-btn mt-8"
        >
          Download PDF Receipt
        </button>
        <button
          onClick={handleSendPDFToEmail}
          className="book-btn mt-4"
        >
          Email PDF Receipt
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
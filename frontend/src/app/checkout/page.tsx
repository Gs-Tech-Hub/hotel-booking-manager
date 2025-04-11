"use client";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import Image from "next/image";
import { useState, useEffect } from "react";
import { strapiService } from "../../utils/strapi";
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';
import dynamic from "next/dynamic";

// const VAT_RATE = 0.02;

const PaystackButton = dynamic(() =>
  import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  if (typeof date === "string") return new Date(date).toLocaleDateString();
  return date.toLocaleDateString();
}

function CheckoutPage() {
  const router = useRouter();
  const {
    checkin,
    checkout,
    guests,
    selectedRoom,
    extras,
    guestInfo,
    nights,
    paymentMethod,
    totalPrice,
    roomTotalPrice,
    selectedMenus,
    updateBooking,
  } = useBookingStore();

  const [showIncompleteError, setShowIncompleteError] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [extrasTotal, setExtrasTotal] = useState(0);
  const { currency } = useCurrency();

  useEffect(() => {
    const roomTotal = roomTotalPrice;
    const menuTotal = selectedMenus.reduce((sum, { item }) => sum + item.price, 0);
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0) + menuTotal;
    // const vatAmount = (roomTotal + extrasTotal) * VAT_RATE;
    const grandTotal = roomTotal + extrasTotal;

    setExtrasTotal(extrasTotal);
    setVatAmount(vatAmount);
    setFinalTotal(grandTotal);
    updateBooking({ totalPrice: grandTotal });
  }, [selectedRoom, nights, extras, roomTotalPrice]);

  const handlePaymentSuccess = async (reference: { reference: string }) => {
    const store = useBookingStore.getState();

    const transactionData = {
      PaymentStatus: "success",
      totalPrice: store.totalPrice,
      transactionID: reference.reference,
      paymentMethod: store.paymentMethod,
    };

    const paymentId = await strapiService.createTransaction(transactionData);
    const customerId = await strapiService.createOrGetCustomer(guestInfo);
    if (!customerId || !paymentId) {
      alert("Error processing payment.");
      return;
    }

    const createdBookingId = await strapiService.createOrGetBooking({
      checkin,
      checkout,
      guests,
      nights,
      totalPrice,
      customer: customerId,
      room: selectedRoom?.documentId,
      payment: paymentId,
    });

    updateBooking({ bookingId: createdBookingId });

    router.push(
        `/booking-confirmation?bookingId=${createdBookingId}&reference=${reference.reference}&email=${guestInfo.email}&amount=${store.totalPrice}&currency=${currency}&checkIn=${formatDate(checkin)}&checkOut=${formatDate(checkout)}&guests=${guests}&room=${selectedRoom?.title}&roomImage=${selectedRoom?.imgUrl}`
      );      
  };

  const handleOfflineBooking = async () => {
    const customerId = await strapiService.createOrGetCustomer(guestInfo);
    if (!customerId) {
      alert("Error: Could not create or retrieve customer.");
      return;
    }

    const createdBookingId = await strapiService.createOrGetBooking({
      checkin,
      checkout,
      guests,
      nights,
      totalPrice,
      customer: customerId,
      room: selectedRoom?.documentId,
    });

    updateBooking({ bookingId: createdBookingId });

    router.push(
      `/booking-confirmation?bookingId=${createdBookingId}&email=${guestInfo.email}&amount=${totalPrice}&checkIn=${formatDate(checkin)}&checkOut=${formatDate(checkout)}&guests=${guests}&room=${selectedRoom?.title}&roomImage=${selectedRoom?.imgUrl}`
    );
  };

  const handleConfirmBooking = () => {
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone || !guestInfo.street || !guestInfo.city || !guestInfo.state || !guestInfo.zip) {
      setShowIncompleteError(true);
      return;
    }

    setShowIncompleteError(false);

    if (paymentMethod === "premise") {
      handleOfflineBooking();
    }
  };

  // 🔁 Final amount calculation using formatted currency output
  const formatted = formatPrice(finalTotal, currency); // e.g., "$123.45"
  const rawAmountForGateway = Math.round(Number(formatted.replace(/[^\d.]/g, "")) * 100);

  const paystackConfig = {
    email: guestInfo.email ?? "",
    amount: rawAmountForGateway,
    currency: currency,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: `${guestInfo.firstName} ${guestInfo.lastName}`,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: guestInfo.phone ?? "",
        },
      ],
    },
    onSuccess: handlePaymentSuccess,
    onClose: () => alert("Payment was not completed."),
  };

  return (
    <div className="our_room">
      <div className="booking-container">
        <h1 className="booking-header text-center">Checkout</h1>
        <div className="checkout-layout">
          {(!selectedRoom || !guestInfo) ? (
            <h2 className="text-center">No booking selected. Please return to the booking page.</h2>
          ) : (
            <>
              <div className="room-card">
                <div className="room-info">
                  {selectedRoom?.imgUrl && (
                    <Image
                      src={selectedRoom.imgUrl}
                      alt={selectedRoom.title}
                      width={350}
                      height={200}
                      className="rounded-lg"
                    />
                  )}
                  <div className="room-details">
                    <h2 className="room-name">{selectedRoom?.title}</h2>
                    <p><strong>Nights:</strong> {nights}</p>
                    <p><strong>Check-in:</strong> {formatDate(checkin)}</p>
                    <p><strong>Check-out:</strong> {formatDate(checkout)}</p>
                    <p><strong>Occupancy:</strong> {guests} {guests > 1 ? "guests" : "guest"}</p>
                    <p className="price price-online"><strong>Price per Night:</strong> {formatPrice(paymentMethod === 'online' ? selectedRoom?.priceOnline : selectedRoom?.pricePremise, currency)}</p>
                  </div>
                </div>
              </div>

              <div className="price-summary">
                <h2 className="room-name">Price Summary</h2>
                <p><strong>Room Total Price:</strong> {formatPrice(roomTotalPrice, currency)}</p>
                <p><strong>Extra Services:</strong> {formatPrice(extrasTotal, currency)}</p>
                {/* <p><strong>VAT ({VAT_RATE}%):</strong> {formatPrice(vatAmount, currency)}</p> */}
                <h3><strong>Final Total:</strong> {formatPrice(finalTotal, currency)}</h3>
              </div>

              <div className="form-container">
                <h2 className="room-name">Guest Information</h2>
                <form className="guest-form">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={guestInfo.firstName || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={guestInfo.lastName || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={guestInfo.email || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={guestInfo.phone || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>Street Address:</label>
                    <input
                        type="text"
                        name="street"
                        value={guestInfo.street || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={guestInfo.city || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>State:</label>
                    <input
                        type="text"
                        name="state"
                        value={guestInfo.state || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />

                    <label>Zip Code:</label>
                    <input
                        type="number"
                        name="zip"
                        value={guestInfo.zip || ""}
                        onChange={e =>
                        updateBooking({ guestInfo: { ...guestInfo, [e.target.name]: e.target.value } })
                        }
                        required
                    />
                    </form>


                {paymentMethod === "online" ? (
                  <PaystackButton {...paystackConfig} className="book-btn mt-4" text="Confirm Payment" />
                ) : (
                  <button className="book-btn mt-4" onClick={handleConfirmBooking}>
                    Confirm Booking
                  </button>
                )}

                {showIncompleteError && (
                  <p className="text-red-500 mt-2">Please fill in all guest information before proceeding.</p>
                )}

                <p className="mt-4 text-sm">
                  By submitting this form you accept our <a href="/policies" className="text-blue-600 hover:underline">terms and conditions and policies</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

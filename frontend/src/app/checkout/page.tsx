"use client";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Image from "next/image";

function CheckoutPage() {
  const router = useRouter();
  const { checkIn, checkOut, guests, selectedRoom, extras, guestInfo, nights, updateBooking } = useBookingStore();
  
  const vatRate = 0.1;
  const roomTotal = selectedRoom ? nights * (selectedRoom.priceOnline || 0) : 0;
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const vatAmount = (roomTotal + extrasTotal) * vatRate;
  const grandTotal = roomTotal + extrasTotal + vatAmount;

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `BOOKING_${Date.now()}`,
    amount: grandTotal,
    currency: "NGN",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: guestInfo.email || "",
      phone_number: guestInfo.phone || "",
      name: `${guestInfo.firstName} ${guestInfo.lastName}`,
    },
    customizations: {
      title: "Hotel Booking Payment",
      description: "Payment for hotel room reservation",
      logo: "https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png/50" // Replace with your actual logo URL
    },
    callback: (response: { transaction_id: number; status: string; currency?: string; amount: number; customer: { email: string; phone_number: string; name: string } }) => {
      console.log("Payment successful:", response);
      const bookingId = `BOOKING_${response.transaction_id.toString()}`;
      router.push(
        `/booking-confirmation?bookingId=${bookingId}&reference=${response.transaction_id}&email=${guestInfo.email}&amount=${grandTotal}&checkIn=${checkIn?.toLocaleDateString() || "N/A"}&checkOut=${checkOut?.toLocaleDateString() || "N/A"}&guests=${guests}&room=${selectedRoom?.title}&roomImage=${selectedRoom?.imgUrl}`
      );
      closePaymentModal();
    },
    onClose: () => {
      alert("Payment was not completed.");
    },
  };

  const initializePayment = useFlutterwave(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({
      guestInfo: { ...guestInfo, [e.target.name]: e.target.value },
    });
  };

  if (!selectedRoom || !guestInfo) {
    return <h2 className="text-center">No booking selected. Please return to the booking page.</h2>;
  };

  return (
    <div className="booking-container">
      <h1 className="booking-header text-center">Checkout</h1>
      <div className="checkout-layout">
        <div className="room-card">
          <div className="room-info">
            {selectedRoom.imgUrl && (
              <Image src={selectedRoom.imgUrl} alt={selectedRoom.title} width={350} height={200} className="rounded-lg" />
            )}
            <div className="room-details">
              <h2 className="room-name">{selectedRoom.title}</h2>
              <p><strong>Nights:</strong> {nights}</p>
              <p><strong>Check-in:</strong> {checkIn ? new Date(checkIn).toLocaleDateString() : "N/A"}</p>
              <p><strong>Check-out:</strong> {checkOut ? new Date(checkOut).toLocaleDateString() : "N/A"}</p>
              <p><strong>Occupancy:</strong> {guests} {guests > 1 ? "guests" : "guest"}</p>
              <p className="price price-online"><strong>Price per Night:</strong> ${selectedRoom.priceOnline.toFixed(2)}</p>
            </div>
          </div>   
        </div>

        <div className="price-summary">
          <h2 className="room-name">Price Summary</h2>
          <p><strong>Room Total:</strong> ${roomTotal.toFixed(2)}</p>
          <p><strong>Extras Total:</strong> ${extrasTotal.toFixed(2)}</p>
          <p><strong>VAT ({(vatRate * 100).toFixed(0)}%):</strong> ${vatAmount.toFixed(2)}</p>
          <p className="total-price"><strong>Grand Total:</strong> ${grandTotal.toFixed(2)}</p>
        </div>

        <div className="form-container">
          <h2 className="room-name">Guest Information</h2>
          <form className="guest-form">
            <label>First Name:</label>
            <input type="text" name="firstName" value={guestInfo.firstName || ""} onChange={handleChange} required />

            <label>Last Name:</label>
            <input type="text" name="lastName" value={guestInfo.lastName || ""} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={guestInfo.email || ""} onChange={handleChange} required />

            <label>Phone:</label>
            <input type="text" name="phone" value={guestInfo.phone || ""} onChange={handleChange} required />
          </form>

          <button className="book-btn mt-4" onClick={() => {
            console.log('Initializing payment...');
            initializePayment({ callback: config.callback, onClose: config.onClose });
          }}>Confirm Payment</button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

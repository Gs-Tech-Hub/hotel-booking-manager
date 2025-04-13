"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { formatPrice } from "@/utils/priceHandler";
import { useCurrency } from "@/context/currencyContext";
import MenuListModal from "@/components/menuListModal";
import ApiHandler from "@/utils/apiHandler";
import Link from "next/link";

interface AvailableExtra {
  id: number;
  name: string;
  price: number;
  type: "service";
}

function BookingSummaryContent() {
  const router = useRouter();
  const {
    checkin,
    checkout,
    guests,
    selectedRoom,
    paymentMethod,
    extras,
    roomTotalPrice,
    selectedMenus,
    removeSelectedMenu,
    updateBooking,
  } = useBookingStore();

  const [selectedExtras, setSelectedExtras] = useState<string[]>((extras || []).map(extra => extra.name));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableExtras, setAvailableExtras] = useState<AvailableExtra[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState(0);  


  const { currency } = useCurrency();
  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || "" });

  useEffect(() => {
    const fetchAvailableExtras = async () => {
      try {
        const response = await apiHandler.fetchData("hotel-services");
        setAvailableExtras(response.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableExtras();
  }, []);

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev =>
      prev.includes(extra) ? prev.filter(item => item !== extra) : [...prev, extra]
    );
  };

  const menuTotal = selectedMenus.reduce(
    (sum, { item, count }) => sum + item.price * count,
    0
  );
  
  const extraTotal = selectedExtras.reduce(
    (sum, extraName) => {
      const extra = availableExtras.find(e => e.name === extraName);
      return sum + (extra?.price || 0);
    },
    0
  );
  
  const serviceTotal = menuTotal + extraTotal;
  const subTotal = roomTotalPrice + menuTotal + extraTotal;

  const discountAmount = subTotal * discountRate;
  const grandTotal = subTotal - discountAmount;

  const applyPromoCode = () => {
    const trimmed = promoCode.trim().toUpperCase();

    if (trimmed === "SAVE10") {
      setDiscountRate(0.10);
      setPromoApplied(true);
      setPromoMessage("Promo code applied! You get 10% off.");
    } else if (trimmed === "SUMMER20") {
      setDiscountRate(0.20);
      setPromoApplied(true);
      setPromoMessage("Promo code applied! You get 20% off.");
    } else if (trimmed === "EXTRA10") {
      setDiscountRate(0.10);
      setPromoApplied(true);
      setPromoMessage("Promo code applied! You get 10% off on extras.");
    } else {
      setDiscountRate(0);
      setPromoApplied(false);
      setPromoMessage("Invalid promo code.");
    }

    // Clear promo code input after applying
    setPromoCode("");
  };

  const handleCheckout = () => {
    const selectedExtrasWithPrices = availableExtras.filter(extra =>
      selectedExtras.includes(extra.name)
    );

    updateBooking({
      extras: selectedExtrasWithPrices,
      selectedMenus: selectedMenus,
      totalPrice: grandTotal,
    });

    router.push("/checkout");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!selectedRoom) {
    return (
      <div className="our_room">
        <div className="booking-container">
          <h1 className="booking-header text-center">Booking Summary</h1>
          <Link href={"/rooms"}>
            <div className="room-card mt-4">
              <h2 className="text-center">No booking details found.</h2>
              <p className="text-center">Please select a room to proceed.</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="our_room">
      <div className="booking-container">
        <h1 className="booking-header text-center">
          Booking Summary for{" "}
          <span className="highlight-text">{selectedRoom.title}</span>
        </h1>

        {error && <p className="text-danger text-center">{error}</p>}

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
                Room Price: {formatPrice(roomTotalPrice, currency)}
              </p>
              <p className="payment-method">
                <strong>Payment Method:</strong>{" "}
                {paymentMethod === "online" ? "Pay Online" : "Pay at Hotel"}
              </p>
            </div>
          </div>
        </div>

        <div className="room-card mt-4">
          <h2 className="room-name">Stay Details</h2>
          <p>
            <strong>Check-in:</strong>{" "}
            {checkin ? new Date(checkin).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {checkout ? new Date(checkout).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Guests:</strong> {guests}
          </p>
        </div>

        <div className="room-card mt-4">
          <h2 className="room-name">Extra Services</h2>
          <div className="extra-options-grid">
            {loading ? (
              <p className="text-center">Loading available extras...</p>
            ) : (
              availableExtras.map(extra => (
                <label key={extra.name} className="extra-option">
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(extra.name)}
                    onChange={() => toggleExtra(extra.name)}
                  />
                  <span className="extra-name">{extra.name}</span>
                  <span className="extra-price">{formatPrice(extra.price, currency)}</span>
                </label>
              ))
            )}

            {selectedMenus.length > 0 ? (
              selectedMenus.map(cartItem => (
                <div
                  key={`${cartItem.localId}`}
                  className="cart-item-details"
                >
                  <div className="">
                    <div>
                      <span className="cart-item-name">{cartItem.item.name}</span>
                    </div>
                    <div>
                      <span className="cart-item-quantity">(Qty: {cartItem.count})</span>
                      <span className="cart-item-menu-type">{cartItem.menuType.categoryName}</span>
                      <span className="cart-item-price">
                        {formatPrice(cartItem.item.price * cartItem.count, currency)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeSelectedMenu(cartItem.item.id, cartItem.menuType)
                    }
                  >
                    <span>×</span>
                  </button>
                </div>
              ))
            ) : (
              <button className="add-btn" onClick={handleOpenModal}>
                Add Food & Drinks
                <span className="add-icon">+</span>
              </button>
            )}
          </div>
        </div>

        <div className="room-card mt-4">
          <h2 className="room-name">Promo Code</h2>
          <div className="promo-code-box">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="form-control mb-2"
            />
            <button onClick={applyPromoCode} className="btn btn-primary btn-sm">
              Apply Code
            </button>
            {promoMessage && <p className="text-info mt-2">{promoMessage}</p>}
          </div>
        </div>

        <div className="room-card mt-4">
          <h2 className="room-name">Total Cost</h2>
          <p>
            <strong>Room Price:</strong> {formatPrice(roomTotalPrice, currency)}
          </p>
          <p>
            <strong>Extras Service Total:</strong> {formatPrice(serviceTotal, currency)}
          </p>
          {promoApplied && (
            <p>
              <strong>Promo Discount ({discountRate * 100}%):</strong> -{formatPrice(discountAmount, currency)}
            </p>
          )}
          <p className="total-price">
            <strong>Grand Total:</strong> {formatPrice(grandTotal, currency)}
          </p>
        </div>

        <button className="book-btn mt-4" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>

      <MenuListModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default function BookingSummary() {
  return (
    <Suspense fallback={<h2 className="text-center">Fetching booking details, please wait...</h2>}>
      <BookingSummaryContent />
    </Suspense>
  );
}

'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { differenceInDays } from "date-fns";

interface Room {
  id: number;
  name: string;
  image: string;
  amenities: string[];
  priceOnline: number;
  pricePremise: number;
  discount: string;
  availability: number;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Suite",
    image: "/images/room1.jpg",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar"],
    priceOnline: 150,
    pricePremise: 160,
    discount: "Save $10 when booking online!",
    availability: 3,
  },
  {
    id: 2,
    name: "Luxury King Room",
    image: "/images/room2.jpg",
    amenities: ["Ocean View", "Flat-screen TV", "Room Service"],
    priceOnline: 200,
    pricePremise: 210,
    discount: "Save $10 when booking online!",
    availability: 2,
  },
];

export default function BookingPage() {
  const router = useRouter();
  const { checkIn, checkOut, updateBooking } = useBookingStore();
  const [nights, setNights] = useState(1);

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(checkOut, checkIn);
      setNights(days > 0 ? days : 1);
    }
  }, [checkIn, checkOut]);

  const handleSelectPayment = (room: Room, paymentType: "online" | "premise") => {
    const totalPrice = paymentType === "online" ? nights * room.priceOnline : nights * room.pricePremise;

    // Persist booking details in Zustand
    updateBooking({
      paymentMethod: paymentType,
      selectedRoom: room,
      totalPrice,
      nights,
    });

    router.push("/booking-summary");
  };

  return (
    <div className="booking-container">
      <h2 className="booking-header">Book Your Stay
      for{" "}
        <span className="highlight-text">
        {nights} night{nights > 1 ? "s" : ""}
        </span>
      </h2>
      <h3 className="text-center text-lg font-bold mt-4">
        Booking for {nights} night{nights > 1 ? "s" : ""}
      </h3>

      <div className="space-y-8">
        {rooms.map((room) => (
          <div key={room.id} className="room-card mt-4 p-4 border rounded-lg shadow">
            <div className="room-info flex gap-4">
              <Image src={room.image} width={350} height={200} className="rounded-lg" alt={room.name} />
              <div className="room-details flex-1">
                <h2 className="room-name text-xl font-bold">{room.name}</h2>
                <p className="room-availability text-sm text-gray-500">{room.availability} rooms left</p>
                <ul className="room-amenities text-sm mt-2">
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>• {amenity}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="room-pricing mt-4">
            <p className="discount-text text-sm text-green-600 mb-4">{room.discount}</p>

              <a
                className="book-btn online"
                onClick={() => handleSelectPayment(room, "online")}
              >
                Pay Online - ${nights * room.priceOnline}
              </a>
              <a
                className="book-btn premise"
                onClick={() => handleSelectPayment(room, "premise")}
              >
                Pay at Hotel - ${nights * room.pricePremise}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

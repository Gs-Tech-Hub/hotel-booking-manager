"use client";

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
  const { checkIn, checkOut } = useBookingStore();
  const [nights, setNights] = useState(1);

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(checkOut, checkIn);
      setNights(days > 0 ? days : 1);
    }
  }, [checkIn, checkOut]);

  const handleBookNow = (room: Room) => {
    const totalPrice = nights * room.priceOnline;

    router.push(
      `/booking-summary?name=${encodeURIComponent(room.name)}&image=${encodeURIComponent(
        room.image
      )}&amenities=${encodeURIComponent(room.amenities.join(", "))}&priceOnline=${totalPrice}&nights=${nights}`
    );
  };

  return (
    <div className="booking-container">
      <h2 className="booking-header">Book Your Stay</h2>
      <h3 className="text-center text-lg font-bold mt-4">
        Booking for {nights} night{nights > 1 ? "s" : ""}
      </h3>
      <div className="space-y-8">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-info">
              <Image src={room.image} width={350} height={200} className="rounded-lg" alt={room.name} />
              <div className="room-details">
                <h2 className="room-name">{room.name}</h2>
                <p className="room-availability">{room.availability} rooms left</p>
                <ul className="room-amenities">
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>• {amenity}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="room-pricing">
              <p className="discount-text">{room.discount}</p>
              <p className="price price-online">Total Price: ${nights * room.priceOnline}</p>
              <p className="price price-premise">At Premise: ${nights * room.pricePremise}</p>
              <button className="book-btn" onClick={() => handleBookNow(room)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

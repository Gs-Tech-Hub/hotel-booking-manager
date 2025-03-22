"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { differenceInDays } from "date-fns";
import ApiHandler from "@/utils/apiHandler";

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Room {
  id: number;
  title: string;
  imgUrl: string;
  description: string;
  price: number;
  amenities: Amenity[];
  bed?: string;
  priceOnline: number;
  discount: string;
  availability: number;
}

export default function BookingPage() {
  const router = useRouter();
  const { checkIn, checkOut, updateBooking } = useBookingStore();
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);

  const apiHandler = ApiHandler({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  });

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(checkOut, checkIn);
      setNights(days > 0 ? days : 1);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
  const fetchRooms = async () => {
    try {
      const data = await apiHandler.fetchData(
        "rooms?populate[amenities][populate]=*&populate[bed][populate]=*"
      );

      const formattedRooms = data.data.map((room: any) => {
        // Extracting the description as a plain string
        const description = room.description
          .map((block: any) => block.children.map((child: any) => child.text).join(" "))
          .join(" ");

        // Extracting amenities names and icons
        const amenities = room.amenities.map((amenity: any) => ({
          id: amenity.id,
          name: amenity.name,
          icon: amenity.icon?.formats?.thumbnail?.url || "",
        }));

        // Extracting bed details
        const bed = room.bed ? `${room.bed.type} (Size: ${room.bed.size} cm)` : "No bed information";

        // Dynamic price calculation
        const priceOnline = room.price * 0.9; // 10% discount for online booking
        const pricePremise = room.price; // Regular price for paying at hotel
        const discount = `Save ${Math.round(100 - (priceOnline / pricePremise) * 100)}% when booking online!`;
        const availability = 5; // Hardcoded availability

        return {
          id: room.id,
          title: room.title,
          description,
          imgUrl: room.imgUrl ?? "", // Ensure imgUrl is always a string
          price: room.price,
          priceOnline,
          pricePremise,
          discount,
          availability,
          amenities,
          bed,
        };
      });

      setRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  fetchRooms();
}, [apiHandler,]);

  const handleSelectPayment = (room: Room, paymentType: "online" | "premise") => {
    const totalPrice = paymentType === "online" ? nights * room.priceOnline : nights * room.price;

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
      <h2 className="booking-header">
        Book Your Stay for{" "}
        <span className="highlight-text">
          {nights} night{nights > 1 ? "s" : ""}
        </span>
      </h2>

      <div className="space-y-8">
        {rooms.map((room) => (
          <div key={room.id} className="room-card mt-4 p-4 border rounded-lg shadow">
            <div className="room-info flex gap-4">
              {room.imgUrl ? (
                <Image
                  src={room.imgUrl}
                  width={350}
                  height={200}
                  className="rounded-lg"
                  alt={room.title}
                />
              ) : (
                <div className="w-[350px] h-[200px] bg-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )}
              <div className="room-details flex-1">
                <h2 className="room-name text-xl font-bold">{room.title}</h2>
                <p className="room-availability text-sm text-gray-500">
                  {room.availability} rooms left
                </p>
                <ul className="room-amenities text-sm mt-2">
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>• {amenity.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="room-pricing mt-4">
              <p className="text-sm text-green-600 mb-4">{room.discount}</p>
              <a
                className="book-btn online"
                onClick={() => handleSelectPayment(room, "online")}
              >
                Pay Online - ₦ {nights * room.priceOnline}
              </a>
              <a
                className="book-btn premise"
                onClick={() => handleSelectPayment(room, "premise")}
              >
                Pay at Hotel - ₦ {nights * room.price}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

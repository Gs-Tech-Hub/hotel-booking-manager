"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { differenceInDays } from "date-fns";
import ApiHandler from "@/utils/apiHandler";
import Loader from "@/components/loader";
import { formatPrice } from "@/utils/priceHandler";
import { useCurrency } from "@/context/currencyContext";
import { getRoomsLeft } from "@/utils/getAvailability";

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Room {
  id: number;
  documentId: string;
  capacity: number;
  title: string;
  imgUrl: string;
  description: string;
  price: number;
  roomTotalPrice: number;
  amenities: Amenity[];
  bed?: string;
  priceOnline: number;
  pricePremise: number;
  discount: string;
  roomsLeft: number; // ✅ new field used instead of `availability`
}

export default function BookingPage() {
  const router = useRouter();
  const { checkin, checkout, updateBooking } = useBookingStore();
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

  const apiHandler = ApiHandler({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  });

  useEffect(() => {
    if (checkin && checkout) {
      const days = differenceInDays(checkout, checkin);
      setNights(days > 0 ? days : 1);
    }
  }, [checkin, checkout]);

  useEffect(() => {
    if (!checkin || !checkout) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await apiHandler.fetchData(
          "rooms?populate[amenities][populate]=*&populate[bed][populate]=*"
        );

        const roomList = data.data;
        const roomsLeftMap: Record<string, number> = {};

        // Pre-fetch rooms left for all rooms
        await Promise.all(
          roomList.map(async (room: any) => {
            const documentId = room.documentId ?? room.id;
            const availableRooms = room.availability || 0;

            const roomsLeft = await getRoomsLeft({
              roomId: documentId,
              availableRooms,
              startDate: checkin.toString(),
              endDate: checkout.toString(),
            });

            roomsLeftMap[documentId] = roomsLeft;
          })
        );

        const formattedRooms = roomList.map((room: any) => {
          const description = room.description
            .map((block: any) =>
              block.children.map((child: any) => child.text).join(" ")
            )
            .join(" ");

          const amenities = room.amenities.map((amenity: any) => ({
            id: amenity.id,
            name: amenity.name,
            icon: amenity.icon?.formats?.thumbnail?.url || "",
          }));

          const bed = room.bed
            ? `${room.bed.type} (Size: ${room.bed.size} cm)`
            : "No bed information";

          const priceOnline = room.price;
          const pricePremise = room.price;
          const discount = `Save ${Math.round(
            100 - (priceOnline / pricePremise) * 100
          )}% when booking online!`;

          const documentId = room.documentId ?? room.id;
          const roomsLeft = roomsLeftMap[documentId] ?? 0;

          return {
            id: room.id,
            documentId,
            title: room.title,
            description,
            imgUrl: room.imgUrl ?? "",
            pricePremise,
            priceOnline,
            discount,
            roomsLeft, // ✅ here we use the real calculated value
            amenities,
            bed,
            capacity: room.capacity,
            roomTotalPrice: 0, // will be calculated on select
          };
        });

        setRooms(formattedRooms);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkin, checkout]);

  const handleSelectPayment = (
    room: Room,
    paymentType: "online" | "premise"
  ) => {
    if (room.roomsLeft === 0) {
      alert("Sorry, this room is not available at the moment Please try another room.");
      return;
    }

    const roomTotalPrice =
      paymentType === "online"
        ? nights * room.priceOnline
        : nights * room.pricePremise;

    updateBooking({
      paymentMethod: paymentType,
      selectedRoom: room,
      roomTotalPrice,
      nights,
    });

    router.push("/booking-summary");
  };

  return (
    <div className="our_room">
      {error && (
        <p className="error-message">
          Error: Could Not Get booking Data, Please try again, or check your
          internet
        </p>
      )}
      <h2 className="booking-header">
        Book Your Stay for{" "}
        <span className="highlight-text">
          {nights} night{nights > 1 ? "s" : ""}
        </span>
      </h2>
      <div className="booking-container">
        {loading && <Loader />}
        <div className="space-y-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="room-card mt-4 p-4 border rounded-lg shadow"
            >
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
                    {room.roomsLeft} rooms left
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
                  Pay Online -{" "}
                  {formatPrice(nights * room.priceOnline, currency)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

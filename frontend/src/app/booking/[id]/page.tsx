"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useBookingStore } from "../../../store/bookingStore";
import { differenceInDays } from "date-fns";
import ApiHandler from "@/utils/apiHandler";
import Loader from "@/components/loader";

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Room {
  id: number;
  documentId: string;
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
  availability: number;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useParams();
  const selectedRoomId =  searchParams.id;

  const { checkin, checkout, updateBooking } = useBookingStore();
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchRooms = async () => {
      try {
        const data = await apiHandler.fetchData("rooms?populate[amenities][populate]=*&populate[bed][populate]=*");

        const formattedRooms = data.data.map((room: any) => ({
          id: room.id,
          documentId: room.documentId,
          title: room.title,
          description: room.description.map((block: any) => block.children.map((child: any) => child.text).join(" ")).join(" "),
          imgUrl: room.imgUrl ?? "",
          pricePremise: room.price,
          priceOnline: room.price * 0.9,
          discount: `Save ${Math.round(100 - ((room.price * 0.9) / room.price) * 100)}% when booking online!`,
          availability: 5,
          amenities: room.amenities.map((amenity: any) => ({
            id: amenity.id,
            name: amenity.name,
            icon: amenity.icon?.formats?.thumbnail?.url || "",
          })),
          bed: room.bed ? `${room.bed.type} (Size: ${room.bed.size} cm)` : "No bed information",
        }));

        const selectedRoom: Room | undefined = formattedRooms.find((room: Room): boolean => {
          console.log('Room ID:', room.documentId, 'Selected ID:', selectedRoomId);
          return room.documentId.toString() === selectedRoomId;
        });
        const otherRooms: Room[] = formattedRooms.filter((room: Room): boolean => room.id.toString() !== selectedRoomId);

        setRooms(selectedRoom ? [selectedRoom, ...otherRooms] : formattedRooms);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selectedRoomId]);

  
  const handleSelectPayment = (room: Room, paymentType: "online" | "premise") => {
    const roomTotalPrice = paymentType === "online" ? nights * room.priceOnline : nights * room.pricePremise;
    updateBooking({
        paymentMethod: paymentType,
        selectedRoom: room,
        roomTotalPrice: roomTotalPrice,
        nights,
      });
    
  router.push('/booking-summary');
  };


  return (
    <div className="our_room">
      <div className="booking-container">
        {loading && <Loader />}
        {error && <p className="error-message">Error: Could Not Get Data, Please Try Again</p>}
  
        <h2 className="booking-header">
          Book Your Stay for <span className="highlight-text">{nights} night{nights > 1 ? "s" : ""}</span>
        </h2>
  
        <div className="space-y-8">
          {rooms.length > 0 && (
            <>
              {/* Selected Room Section */}
              <h3 className="titlepage text-lg font-bold">Your Selected Room</h3>
              <div key={rooms[0].id} className="room-card mt-4 p-4 border rounded-lg shadow">
                <div className="room-info flex gap-4">
                  {rooms[0].imgUrl ? (
                    <Image
                      src={rooms[0].imgUrl}
                      width={350}
                      height={200}
                      className="rounded-lg"
                      alt={rooms[0].title}
                    />
                  ) : (
                    <div className="w-[350px] h-[200px] bg-gray-300 flex items-center justify-center rounded-lg">
                      <span className="text-gray-600">No Image Available</span>
                    </div>
                  )}
                  <div className="room-details flex-1">
                    <h2 className="room-name text-xl font-bold">{rooms[0].title}</h2>
                    <p className="room-availability text-sm text-gray-500">
                      {rooms[0].availability} rooms left
                    </p>
                    <ul className="room-amenities text-sm mt-2">
                      {rooms[0].amenities.map((amenity, index) => (
                        <li key={index}>• {amenity.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="room-pricing mt-4">
                  <p className="text-sm text-green-600 mb-4">{rooms[0].discount}</p>
                  <a
                    className="book-btn online"
                    onClick={() => handleSelectPayment(rooms[0], "online")}
                  >
                    Pay Online - ₦ {nights * rooms[0].priceOnline}
                  </a>
                  <a
                    className="book-btn premise"
                    onClick={() => handleSelectPayment(rooms[0], "premise")}
                  >
                    Pay at Hotel - ₦ {nights * rooms[0].pricePremise}
                  </a>
                </div>
              </div>
  
              {/* Other Rooms Section */}
              {rooms.length > 1 && (
                <div className="container">
                  <div className="mt-12">
                  <h3 className=" booking-header text-lg font-bold">See Other Rooms</h3>
                  </div>
                  <div className="hotel-grid">
                  {rooms.slice(1).map((room) => (
                    <div key={room.id} className="hotel-card p-4 border rounded-lg shadow">
                      <div className="room-info flex gap-4">
                        {room.imgUrl ? (
                          <Image
                            src={room.imgUrl}
                            width={150}
                            height={100}
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
                          Pay at Hotel - ₦ {nights * room.pricePremise}
                        </a>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
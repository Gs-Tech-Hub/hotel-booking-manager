"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import BookingForm from "@/components/booking-form"; // Import BookingForm

interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

interface Room {
  id: number;
  documentId: string;
  title: string;
  imgUrl: string;
  description: string;
  price: number;
  amenities: Amenity[];
  bed?: string;
  photos: string[];
}

const extractDescription = (descriptionArray: any[]): string => {
  if (!Array.isArray(descriptionArray)) return "No description available";
  return descriptionArray
    .map((desc) =>
      desc.children ? desc.children.map((child: any) => child.text).join(" ") : ""
    )
    .join("\n");
};

export default function RoomDetailsPage() {
  const params = useParams();
  const documentId = params?.id ?? null;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || "" });

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      setError("Invalid document ID");
      return;
    }

    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching room details for document ID: ${documentId}`);
        const data = await apiHandler.fetchData(`rooms/${documentId}?populate=*`);

        if (!data || !data.data) {
          throw new Error("Room not found");
        }

        const roomData = data.data;

        const formattedRoom: Room = {
          id: roomData.id,
          documentId: roomData.documentId,
          title: roomData.title ?? "Untitled Room",
          imgUrl: roomData.imgUrl ?? "/default-room.jpg",
          description: extractDescription(roomData.description),
          price: roomData.price ?? 0,
          amenities: Array.isArray(roomData.amenities)
            ? roomData.amenities.map((amenity: any): Amenity => ({
                id: amenity.id,
                name: amenity.name ?? "Unknown Amenity",
                icon: amenity.icon?.formats?.thumbnail?.url ?? "",
              }))
            : [],
          bed:
            roomData.bed && typeof roomData.bed.type === "string" && typeof roomData.bed.size === "number"
              ? `${roomData.bed.type} (Size: ${roomData.bed.size} cm)`
              : "No bed information",
          photos: Array.isArray(roomData.roomPhotos)
            ? roomData.roomPhotos.map((photo: any) => photo.url)
            : [],
        };

        setRoom(formattedRoom);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [documentId, apiHandler]);

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!room) return <p>Room not found.</p>;

  return (
    <div className="container">
      <h1>{room.title}</h1>

      {/* Room Photos */}
      <div className="room-photos">
        {room.photos.length > 0 ? (
          room.photos.map((photo, index) => (
            <Image key={index} src={photo} alt={room.title} width={800} height={450} />
          ))
        ) : (
          <Image src={room.imgUrl} alt={room.title} width={800} height={450} />
        )}
      </div>

      <p>{room.description}</p>
      <p className="room-price">Price: ₦ {room.price}</p>
      <p className="room-size">BED-SIZE: {room.bed ?? "Size not specified"}</p>

      <div className="amenities-section">
        <h4>Amenities:</h4>
        <ul style={{ display: "flex", listStyleType: "none", padding: 0 }}>
          {room.amenities.map((amenity) => (
            <li key={amenity.id} style={{ marginRight: "10px" }}>
              {amenity.icon ? (
                <Image src={amenity.icon} alt={amenity.name} width={20} height={20} />
              ) : (
                <span>{amenity.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Integrated Booking Form Here */}
      <div className="room-booking-form">
        <BookingForm />
      </div>
    </div>
  );
}

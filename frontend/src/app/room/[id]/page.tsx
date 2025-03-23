'use client'
import { useEffect, useState, Fragment } from "react";
import { useParams } from "next/navigation";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import BookingForm from "@/components/booking-form";

interface Amenity {
  id: number;
  name: string;
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
            ? roomData.amenities.map((amenity: any) => ({
                id: amenity.id,
                name: amenity.name ?? "Unknown Amenity",
              }))
            : [],
          bed:
            roomData.bed && typeof roomData.bed.type === "string" && typeof roomData.bed.size === "number"
              ? `${roomData.bed.type} (Size: ${roomData.bed.size} cm)`
              : "No bed information",
          photos: Array.isArray(roomData.roomPhotos)
            ? roomData.roomPhotos.map(
                (photo: any) =>
                  photo.formats?.large?.url ||
                  photo.formats?.medium?.url ||
                  photo.url
              )
            : [],
        };

        console.log("Mapped room photos:", formattedRoom.photos);

        setRoom(formattedRoom);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [documentId]);

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!room) return <p>Room not found.</p>;

  return (
    <Fragment>
      <div className="our_room">
        <div className="booking-header">
          <h1>{room.title}</h1>

          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="room-photos flex-1">
              <Image
                src={room.imgUrl}
                alt={room.title}
                width={800}
                height={450}
                className="rounded-xl mb-4 object-cover"
              />
              <div className="thumbnail-gallery grid grid-cols-2 md:grid-cols-4 gap-4">
                {[room.imgUrl, ...room.photos].map((photo, index) => (
                  <Image
                    key={index}
                    src={photo}
                    alt={`Room thumbnail ${index + 1}`}
                    width={250}
                    height={200}
                    className="thumbnail-image rounded-xl border border-gray-300"
                  />
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl shadow align-items-center justify-between flex-1 ">
              <div>
              <p className="text-lg font-semibold mb-2">Price: ₦ {room.price}</p>
              <p className="text-md mb-4">BED-SIZE: {room.bed ?? "Size not specified"}</p>
              
              <div className="amenities-section">
                <h4 className="text-lg font-medium mb-2">Amenities:</h4>
                <ul className="extra-options-grid">
                  {room.amenities.map((amenity) => (
                    <li key={amenity.id} className="room-amenities">
                      {amenity.name}
                    </li>
                  ))}
                </ul>
            </div>
            </div>
              <div className="mt-8">
               <h2 className="text-2xl font-semibold mb-4">Room Description</h2>
               <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {room.description}
              </p>
              </div>
            <div>
              </div>
            </div>
            </div>
          </div>
          <div className="booking-area">
          <BookingForm />
          </div>
        </div>
    </Fragment>
  );
}

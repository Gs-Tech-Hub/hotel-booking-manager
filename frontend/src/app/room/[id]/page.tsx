'use client';
import { useEffect, useState, Fragment } from "react";
import { useParams } from "next/navigation";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import BookingForm from "@/components/booking-form";
import Loader from "@/components/loader";
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';

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
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

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
        const data = await apiHandler.fetchData(
          `rooms/${documentId}?populate[roomPhotos][populate]=*&populate[amenities][populate]=*&populate[bed][populate]=*`
        );

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
          amenities: roomData.amenities.map((amenity: any) => ({
            id: amenity.id,
            name: amenity.name,
            icon: amenity.icon ? amenity.icon.formats.thumbnail.url : '',
          })) || [],
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

        setRoom(formattedRoom);
        setMainImage(formattedRoom.imgUrl); // Set main image initially
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [documentId]);

  return (
    <Fragment>
      <div className="our_room">
        <div className="booking-header">
          {loading && <Loader />}
          {error && <p className="error-message">Error: Could Not Get Room Data, Please try again or check your internet</p>}
          {!room && !loading && !error && <p>Room not found.</p>}

          {room && (
            <div>
              <h1>{room.title}</h1>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="room-photos flex-1">
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={room.title}
                      width={800}
                      height={450}
                      className="rounded-xl mb-4 object-cover"
                    />
                  )}
                  <div className="thumbnail-gallery-scroll flex flex-wrap gap-2">
                    {[room.imgUrl, ...room.photos]
                      .filter((photo) => photo !== mainImage)
                      .map((photo, index) => (
                        <Image
                          key={index}
                          src={photo}
                          alt={`Room thumbnail ${index + 1}`}
                          width={200}
                          height={150}
                          className="thumbnail-image rounded-xl border border-gray-300 cursor-pointer"
                          onClick={() => setMainImage(photo)}
                        />
                      ))}
                  </div>
                </div>

                <div className="room-details-card">
                  <p className="text-lg font-semibold mb-2">Price: {formatPrice(room.price, currency)}</p>
                  <p className="text-lg mb-4">BED-SIZE: {room.bed ?? "Size not specified"}</p>

                  <div className="container">
                    <div className="amenities-section">
                      <h4 className="text-lg font-medium mb-2">Amenities:</h4>
                      <ul className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <li key={amenity.id}>
                            {amenity.icon ? (
                              <Image
                                src={amenity.icon}
                                alt={amenity.name}
                                width={20}
                                height={20}
                              />
                            ) : (
                              <span>{amenity.name}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="">
                    <h2 className="text-2xl font-semibold mb-4">Room Description</h2>
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                      {room.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="booking-area">
          <BookingForm />
        </div>
      </div>
    </Fragment>
  );
}

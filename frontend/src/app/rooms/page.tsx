"use client";

import { useEffect, useState } from "react";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import Link from "next/link";
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
  amenities: Amenity[];
  bed?: string;
}

const renderDescription = (description: any) => {
  if (typeof description === "string") {
    return description; // Return string directly
  }

  if (description && Array.isArray(description.children)) {
    return description.children.map((child: any, index: number) => (
      <span key={index}>{child.text}</span>
    ));
  }

  return "No description available"; // Fallback if the structure is unexpected
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || "" });

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const data = await apiHandler.fetchData("rooms?populate[amenities][populate]=*&populate[bed][populate]=*");

        const formattedRooms: Room[] = data.data.map((room: any) => ({
          id: room.id,
          documentId: room.documentId ?? "",
          title: typeof room.title === "string" ? room.title : "Untitled Room",
          imgUrl: typeof room.imgUrl === "string" ? room.imgUrl : "/default-room.jpg",
          description: renderDescription(room.description), // Format description
          price: typeof room.price === "number" ? room.price : 0,
          amenities: Array.isArray(room.amenities)
            ? room.amenities.map((amenity: any): Amenity => ({
                id: amenity.id,
                name: amenity.name ?? "Unknown Amenity",
                icon: amenity.icon ? amenity.icon.formats.thumbnail.url : "",
              }))
            : [],
          bed: room.bed
            ? `${room.bed.type} (Size: ${room.bed.size} cm)`
            : "No bed information",
        }));

        setRooms(formattedRooms);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsData();
  }, [apiHandler]);

  if (loading) return <Loader />;
  if (error) return <p>Error: Could Not Get Rooms Data, Please try again</p>;

  return (
    <div className="our_room">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="titlepage">
              <h2>Our Rooms</h2>
              <p>Explore our luxurious rooms, designed for your comfort and relaxation.</p>
            </div>
          </div>
        </div>
        <div className="row">
          {rooms.map((room) => (
            <div key={room.documentId} className="col-md-4 col-sm-6">
              <Link href={`/room/${room.documentId}`} passHref>
                <div id="serv_hover" className="room" style={{ cursor: "pointer" }}>
                  <div className="room_img">
                    <figure>
                      <Image src={room.imgUrl} alt={room.title} layout="responsive" width={375} height={232} />
                    </figure>
                  </div>
                  <div className="bed_room">
                    <h3>{room.title}</h3>
                    <p>{room.description}</p>
                    <p className="room-price">Price: ₦ {room.price}</p>
                    <p className="room-size">BED-SIZE: {room.bed ?? "Size not specified"}</p>
                    <div className="amenities-section" style={{ textAlign: "center" }}>
                      <h4 style={{ marginTop: "10px" }}>Amenities:</h4>
                      <ul style={{ display: "flex", justifyContent: "center", listStyleType: "none", padding: 0 }}>
                        {room.amenities.map((amenity) => (
                          <li key={amenity.id} style={{ marginRight: "10px" }}>
                            {amenity.icon ? (
                              <Image src={amenity.icon} alt={amenity.name} width={20} height={20} />
                            ) : (
                              <span>Icon</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

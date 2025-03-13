"use client";

import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
}

export interface RoomSectionProps {
   rooms: Room[];
}

export const renderDescription = (description: any) => {
   if (typeof description === "string") {
      return description; // If it's a string, return it directly
   }

   if (description && Array.isArray(description.children)) {
      return description.children.map((child: any, index: number) => (
         <span key={index}>{child.text}</span> // Render each child text
      ));
   }

   return null; // Fallback if the structure is unexpected
};

export default function RoomSection() {
   const [rooms, setRooms] = useState<RoomSectionProps["rooms"]>([]);

   const apiHandler = ApiHandler({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });

   useEffect(() => {
      const fetchRoomsData = async () => {
         try {
            const data = await apiHandler.fetchData(
               "rooms?populate[amenities][populate]=*&populate[bed][populate]=*"
            ); // Fetching from the correct endpoint
            const formattedRooms = data.data.map((room: any) => ({
               id: room.id,
               title: room.title,
               imgUrl: room.imgUrl,
               description: renderDescription(room.description), // Use renderDescription to format the description
               price: room.price,
               amenities:
                  room.amenities.map((amenity: any) => ({
                     id: amenity.id,
                     name: amenity.name,
                     icon: amenity.icon
                        ? amenity.icon.formats.thumbnail.url
                        : "", // Get the icon URL from the amenity data
                  })) || [], // Default to an empty array if no amenities
               bed: room.bed
                  ? `${room.bed.type} (Size: ${room.bed.size} cm)`
                  : "No bed information", // Extract bed information
            }));
            setRooms(formattedRooms); // Update state with formatted room data
            console.log("Formatted rooms data:", formattedRooms); // Log the formatted rooms data
         } catch (error) {
            console.error("Error fetching room data:", error);
         }
      };
      fetchRoomsData();
   });

   return (
      <div className="our_room">
         <div className="container">
            <div className="row">
               <div className="col-md-12">
                  <div className="titlepage">
                     <h2>Our Room</h2>
                     <p>
                        Discover our luxurious rooms, designed for your comfort
                        and relaxation.
                     </p>
                  </div>
               </div>
            </div>
            <div className="row">
               {rooms.map((room) => (
                  <Link
                     key={room.id}
                     href={`/rooms/${room.id}`}
                     className="col-md-4 col-sm-6"
                  >
                     <div>
                        <div id="serv_hover" className="room">
                           <div className="room_img">
                              <figure>
                                 <Image
                                    src={room.imgUrl}
                                    alt={room.title}
                                    layout="responsive"
                                    width={375}
                                    height={232}
                                 />
                              </figure>
                           </div>
                           <div className="bed_room">
                              <h3>{room.title}</h3>
                              <p>{room.description}</p>
                              <p className="room-price">
                                 Price: ₦ {room.price}
                              </p>
                              <p className="room-size">
                                 BED-SIZE:{" "}
                                 {room.bed ? room.bed : "Size not specified"}
                              </p>
                              <div
                                 className="amenities-section"
                                 style={{ textAlign: "center" }}
                              >
                                 <h4 style={{ marginTop: "10px" }}>
                                    Amenities:
                                 </h4>
                                 <ul
                                    style={{
                                       display: "flex",
                                       justifyContent: "center",
                                       listStyleType: "none",
                                       padding: 0,
                                    }}
                                 >
                                    {room.amenities.map((amenity) => (
                                       <li
                                          key={amenity.id}
                                          style={{ marginRight: "10px" }}
                                       >
                                          {amenity.icon ? (
                                             <Image
                                                src={amenity.icon}
                                                alt={amenity.name}
                                                width={20}
                                                height={20}
                                             />
                                          ) : (
                                             <span>Icon</span>
                                          )}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}

"use client";

import { renderDescription, RoomSectionProps } from "@/components/room-section";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room() {
   const params = useParams();
   const id = params.id;

   const [rooms, setRooms] = useState<RoomSectionProps["rooms"]>([]);

   const apiHandler = ApiHandler({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });

   useEffect(() => {
      const fetchRoomsData = async () => {
         try {
            // const data = await apiHandler.fetchData(
            //    `rooms/${id}/?populate[amenities][populate]=*&populate[bed][populate]=*`
            // ); // Fetching from the correct endpoint
            // const formattedRooms = data.data.map((room: any) => ({
            //    id: room.id,
            //    title: room.title,
            //    imgUrl: room.imgUrl,
            //    description: renderDescription(room.description), // Use renderDescription to format the description
            //    price: room.price,
            //    amenities:
            //       room.amenities.map((amenity: any) => ({
            //          id: amenity.id,
            //          name: amenity.name,
            //          icon: amenity.icon
            //             ? amenity.icon.formats.thumbnail.url
            //             : "", // Get the icon URL from the amenity data
            //       })) || [], // Default to an empty array if no amenities
            //    bed: room.bed
            //       ? `${room.bed.type} (Size: ${room.bed.size} cm)`
            //       : "No bed information", // Extract bed information
            // }));
            setRooms([]); // Update state with formatted room data
            // console.log("Formatted rooms data:", formattedRooms); // Log the formatted rooms data
         } catch (error) {
            console.error("Error fetching room data:", error);
         }
      };
      fetchRoomsData();
   }, []);

   return (
      <div className="our_room">
         <div className="row">
            {rooms.map((room) => (
               <div key={room.id} className="col-md-4 col-sm-6">
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
                        <p className="room-price">Price: ₦ {room.price}</p>
                        <p className="room-size">
                           BED-SIZE:{" "}
                           {room.bed ? room.bed : "Size not specified"}
                        </p>
                        <div
                           className="amenities-section"
                           style={{ textAlign: "center" }}
                        >
                           <h4 style={{ marginTop: "10px" }}>Amenities:</h4>
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
            ))}
         </div>
      </div>
   );
}

'use client'
import React, { useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { strapiService } from "@/utils/dataEndPoint";
import { Booking } from "@/types/bookingTypes";
import { ServiceItem } from "@/types/serviceTypes";

export default function AccountSummary() {
  useRoleGuard(["admin", "manager", "sales"]);

  const [overviewData, setOverviewData] = useState({
    hotel: { total: 0, cash: 0, online: 0, debt: 0 },
    bar: { total: 0, cash: 0, online: 0, debt: 0 },
    restaurant: { total: 0, cash: 0, online: 0, debt: 0 },
    swimming_pool: { total: 0, cash: 0, online: 0, debt: 0 },
    games: { total: 0, cash: 0, online: 0, debt: 0 },
  });

  const [timeFrame, setTimeFrame] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), // Default: Last 30 days
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await strapiService.getBookings({
          populate: "*",
          "pagination[pageSize]": 50,
          "filters[createdAt][$gte]": timeFrame.startDate,
          "filters[createdAt][$lte]": timeFrame.endDate,
        });

        const otherServicesData = await strapiService.getBookingItems({
          populate: "*",
          "pagination[pageSize]": 50,
          "filters[createdAt][$gte]": timeFrame.startDate,
          "filters[createdAt][$lte]": timeFrame.endDate,
        });

        console.log("Booking Data:", bookingData);
        console.log("Other Services Data:", otherServicesData);

        const aggregatedData = {
          hotel: { total: 0, cash: 0, online: 0, debt: 0 },
          bar: { total: 0, cash: 0, online: 0, debt: 0 },
          restaurant: { total: 0, cash: 0, online: 0, debt: 0 },
          swimming_pool: { total: 0, cash: 0, online: 0, debt: 0 },
          games: { total: 0, cash: 0, online: 0, debt: 0 },
        };

        // Process booking data
        if (Array.isArray(bookingData)) {
          bookingData.forEach((booking: Booking) => {
            const roomPrice: number = booking.room?.price || 0;
            const nights: number = booking.nights || 0;
            const totalRoomPrice: number = roomPrice * nights;
            const paymentStatus: string = booking.payment?.PaymentStatus || "debt";
            const paymentMethod = (booking.payment?.paymentMethod || "cash") as "cash" | "online";

            aggregatedData.hotel.total += totalRoomPrice;

            if (paymentStatus === "success") {
              aggregatedData.hotel[paymentMethod] += totalRoomPrice;
            } else {
              aggregatedData.hotel.debt += totalRoomPrice;
            }
          });
        } else {
          console.warn("No booking data available or invalid format.");
        }

        // Process other services data
        if (Array.isArray(otherServicesData)) {
          otherServicesData.forEach((service: ServiceItem) => {
            const amountPaid: number = service.amount_paid || 0;
            const paymentStatus: string = service.status || "debt";
            const department: string = service.menu_category?.categoryName || "unknown";

            if (department === "Bar") {
              aggregatedData.bar.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.bar.cash += amountPaid;
              } else {
                aggregatedData.bar.debt += amountPaid;
              }
            } else if (department === "Restaurant") {
              aggregatedData.restaurant.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.restaurant.cash += amountPaid;
              } else {
                aggregatedData.restaurant.debt += amountPaid;
              }
            } else if (department === "Swimming Pool") {
              aggregatedData.swimming_pool.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.swimming_pool.cash += amountPaid;
              } else {
                aggregatedData.swimming_pool.debt += amountPaid;
              }
            }
          });
        } else {
          console.warn("No other services data available or invalid format.");
        }

        setOverviewData(aggregatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div>
      <h1>Sales Overview</h1>
      <div className="mb-4">
        <label>
          Start Date:
          <input
            type="date"
            value={new Date(timeFrame.startDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setTimeFrame((prev) => ({
                ...prev,
                startDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={new Date(timeFrame.endDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setTimeFrame((prev) => ({
                ...prev,
                endDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </label>
      </div>
      <OverviewCardsGroup
        hotel={overviewData.hotel}
        restaurant={overviewData.restaurant}
        bar={overviewData.bar}
        swimming_pool={overviewData.swimming_pool}
        games={overviewData.games} // Placeholder for games data
      />
    </div>
  );
}

[
    {
        "id": 94,
        "documentId": "zmj5rc8rrkh6lijw54z9ywb4",
        "quantity": 2,
        "createdAt": "2025-04-25T19:46:40.274Z",
        "updatedAt": "2025-04-25T19:46:40.274Z",
        "publishedAt": "2025-04-25T19:46:42.749Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 96,
        "documentId": "t2hwg30jougdklci7r8ni275",
        "quantity": 2,
        "createdAt": "2025-04-25T19:56:02.875Z",
        "updatedAt": "2025-04-25T19:56:02.875Z",
        "publishedAt": "2025-04-25T19:56:05.331Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 98,
        "documentId": "namcvynjzvvs3rgmjxlm4c2e",
        "quantity": 2,
        "createdAt": "2025-04-25T20:17:06.853Z",
        "updatedAt": "2025-04-25T20:17:06.853Z",
        "publishedAt": "2025-04-25T20:17:09.359Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 100,
        "documentId": "r41aud7xk1clfpbiun2grnpg",
        "quantity": 1,
        "createdAt": "2025-04-25T20:20:52.865Z",
        "updatedAt": "2025-04-25T20:20:52.865Z",
        "publishedAt": "2025-04-25T20:20:55.294Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 102,
        "documentId": "oth4fpp8w0eh7v61ukn7bf7w",
        "quantity": 1,
        "createdAt": "2025-04-25T20:22:35.067Z",
        "updatedAt": "2025-04-25T20:22:35.067Z",
        "publishedAt": "2025-04-25T20:22:37.479Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 104,
        "documentId": "vyp8if0hor5demuh8xgafyne",
        "quantity": 1,
        "createdAt": "2025-04-25T20:25:34.116Z",
        "updatedAt": "2025-04-25T20:25:34.116Z",
        "publishedAt": "2025-04-25T20:25:36.574Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 106,
        "documentId": "hsw3mcvb2utncpdw2d2aixys",
        "quantity": 1,
        "createdAt": "2025-04-25T20:44:16.048Z",
        "updatedAt": "2025-04-25T20:44:16.048Z",
        "publishedAt": "2025-04-25T20:44:18.508Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 108,
        "documentId": "vxe09nnlh1druxh5oqjzfj6q",
        "quantity": 1,
        "createdAt": "2025-04-25T20:47:52.673Z",
        "updatedAt": "2025-04-25T20:47:52.673Z",
        "publishedAt": "2025-04-25T20:47:55.103Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 110,
        "documentId": "v3r8lrsnaprvmrlru1a5vvtg",
        "quantity": 1,
        "createdAt": "2025-04-25T20:57:25.856Z",
        "updatedAt": "2025-04-25T20:57:25.856Z",
        "publishedAt": "2025-04-25T20:57:28.315Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 112,
        "documentId": "r2rke1dvjowb0ph4k8rfszvw",
        "quantity": 1,
        "createdAt": "2025-04-25T21:02:33.582Z",
        "updatedAt": "2025-04-25T21:02:33.582Z",
        "publishedAt": "2025-04-25T21:02:36.058Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 114,
        "documentId": "z7d37o963p61wzb5zy91swj7",
        "quantity": 1,
        "createdAt": "2025-04-25T21:12:28.775Z",
        "updatedAt": "2025-04-25T21:12:28.775Z",
        "publishedAt": "2025-04-25T21:12:31.254Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 116,
        "documentId": "ga8aun4sle3yrm5nelo1f141",
        "quantity": 1,
        "createdAt": "2025-04-25T21:16:54.033Z",
        "updatedAt": "2025-04-25T21:16:54.033Z",
        "publishedAt": "2025-04-25T21:16:56.547Z",
        "amount_paid": null,
        "status": null,
        "drinks": [],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [
            {
                "id": 42,
                "documentId": "wtxsbb54l6icw7qwbnp7fvud",
                "name": "Eba/Semo/Poundo with Banga Soup and Chicken",
                "description": [
                    {
                        "type": "paragraph",
                        "children": [
                            {
                                "text": "No description provided.",
                                "type": "text"
                            }
                        ]
                    }
                ],
                "price": 10000,
                "createdAt": "2025-04-11T06:20:02.886Z",
                "updatedAt": "2025-04-11T06:20:02.886Z",
                "publishedAt": "2025-04-11T06:20:04.069Z"
            }
        ],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 118,
        "documentId": "qdlje78aisky7imjyvu46gl6",
        "quantity": 1,
        "createdAt": "2025-04-25T21:20:18.722Z",
        "updatedAt": "2025-04-25T21:20:18.722Z",
        "publishedAt": "2025-04-25T21:20:21.190Z",
        "amount_paid": null,
        "status": null,
        "drinks": [],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [
            {
                "id": 42,
                "documentId": "wtxsbb54l6icw7qwbnp7fvud",
                "name": "Eba/Semo/Poundo with Banga Soup and Chicken",
                "description": [
                    {
                        "type": "paragraph",
                        "children": [
                            {
                                "text": "No description provided.",
                                "type": "text"
                            }
                        ]
                    }
                ],
                "price": 10000,
                "createdAt": "2025-04-11T06:20:02.886Z",
                "updatedAt": "2025-04-11T06:20:02.886Z",
                "publishedAt": "2025-04-11T06:20:04.069Z"
            }
        ],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 120,
        "documentId": "aibpjp2swf20nnyuvvgb4uz8",
        "quantity": 1,
        "createdAt": "2025-04-25T21:20:27.913Z",
        "updatedAt": "2025-04-25T21:20:27.913Z",
        "publishedAt": "2025-04-25T21:20:30.373Z",
        "amount_paid": null,
        "status": null,
        "drinks": [],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [
            {
                "id": 10,
                "documentId": "b31w22x1frx09d721xbd0dtv",
                "name": "Swimming Pool",
                "serviceDescription": "swimming",
                "createdAt": "2025-04-11T16:16:48.481Z",
                "updatedAt": "2025-04-12T11:14:09.012Z",
                "publishedAt": "2025-04-12T11:14:11.163Z",
                "price": 3000
            }
        ],
        "games": []
    },
    {
        "id": 122,
        "documentId": "n9w2rzhlp6hvk46xoeze5m5z",
        "quantity": 1,
        "createdAt": "2025-04-25T21:28:45.936Z",
        "updatedAt": "2025-04-25T21:28:45.936Z",
        "publishedAt": "2025-04-25T21:28:48.397Z",
        "amount_paid": null,
        "status": null,
        "drinks": [],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [
            {
                "id": 42,
                "documentId": "wtxsbb54l6icw7qwbnp7fvud",
                "name": "Eba/Semo/Poundo with Banga Soup and Chicken",
                "description": [
                    {
                        "type": "paragraph",
                        "children": [
                            {
                                "text": "No description provided.",
                                "type": "text"
                            }
                        ]
                    }
                ],
                "price": 10000,
                "createdAt": "2025-04-11T06:20:02.886Z",
                "updatedAt": "2025-04-11T06:20:02.886Z",
                "publishedAt": "2025-04-11T06:20:04.069Z"
            }
        ],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 124,
        "documentId": "h1ey94wh24lnvfcfotmy18b5",
        "quantity": 1,
        "createdAt": "2025-04-25T21:28:54.809Z",
        "updatedAt": "2025-04-25T21:28:54.809Z",
        "publishedAt": "2025-04-25T21:28:57.313Z",
        "amount_paid": null,
        "status": null,
        "drinks": [],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [
            {
                "id": 10,
                "documentId": "b31w22x1frx09d721xbd0dtv",
                "name": "Swimming Pool",
                "serviceDescription": "swimming",
                "createdAt": "2025-04-11T16:16:48.481Z",
                "updatedAt": "2025-04-12T11:14:09.012Z",
                "publishedAt": "2025-04-12T11:14:11.163Z",
                "price": 3000
            }
        ],
        "games": []
    },
    {
        "id": 126,
        "documentId": "na90ytq4f53i328jgp4es44a",
        "quantity": 1,
        "createdAt": "2025-04-25T22:38:45.192Z",
        "updatedAt": "2025-04-25T22:38:45.192Z",
        "publishedAt": "2025-04-25T22:38:47.660Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 127,
                "documentId": "ciswz8v3fem20iluiinds59w",
                "name": "Action Bitters",
                "description": null,
                "price": 2000,
                "createdAt": "2025-04-11T15:58:51.860Z",
                "updatedAt": "2025-04-25T22:38:36.683Z",
                "publishedAt": "2025-04-25T22:38:38.997Z",
                "type": null,
                "quantity": 48,
                "threshold": 12,
                "availability": true,
                "sold": null,
                "bar_stock": 35,
                "restaurant_stock": null,
                "supplied": 48
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 128,
        "documentId": "hnhgiz3cksr37lol7qw0b5ee",
        "quantity": 1,
        "createdAt": "2025-04-26T07:06:51.982Z",
        "updatedAt": "2025-04-26T07:06:51.982Z",
        "publishedAt": "2025-04-26T07:06:54.457Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 132,
                "documentId": "g825badhdwef2m0o4cp2ktwk",
                "name": "Amstel Malt",
                "description": null,
                "price": 1100,
                "createdAt": "2025-04-11T14:33:30.533Z",
                "updatedAt": "2025-04-26T07:06:43.338Z",
                "publishedAt": "2025-04-26T07:06:45.671Z",
                "type": null,
                "quantity": 120,
                "threshold": 48,
                "availability": null,
                "sold": null,
                "bar_stock": 20,
                "restaurant_stock": 24,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    },
    {
        "id": 130,
        "documentId": "waclkb48dxrk9w5kjo0isglp",
        "quantity": 2,
        "createdAt": "2025-04-26T07:18:37.079Z",
        "updatedAt": "2025-04-26T07:18:37.079Z",
        "publishedAt": "2025-04-26T07:18:39.580Z",
        "amount_paid": null,
        "status": null,
        "drinks": [
            {
                "id": 133,
                "documentId": "vdu14c4nf5uwdgtqm4cvl7k5",
                "name": "Heinekein",
                "description": null,
                "price": 2500,
                "createdAt": "2025-04-11T16:00:14.264Z",
                "updatedAt": "2025-04-26T07:18:27.563Z",
                "publishedAt": "2025-04-26T07:18:29.871Z",
                "type": null,
                "quantity": 96,
                "threshold": 36,
                "availability": null,
                "sold": null,
                "bar_stock": 82,
                "restaurant_stock": null,
                "supplied": 120
            }
        ],
        "boookings": [],
        "food_type": null,
        "drink_type": null,
        "food_items": [],
        "menu_category": null,
        "hotel_services": [],
        "games": []
    }
]
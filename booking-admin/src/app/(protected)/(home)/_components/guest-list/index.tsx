"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,     
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { strapiService } from "@/utils/dataEndPoint";

export function GuestList({ className }: { className?: string }) {
  interface Guest {
    documentId: string
    bookingId: string;
    customer: {
      firstName: string;
      lastName: string;
    };

    room: {
      title: string;
    };
    
    name: string;
    roomType: string;
    roomNumber: string;
    nights: number;
    duration: number;
    checkin: string;
    checkout: string;
    book_status: string;
    status: string;
  }

  const [data, setData] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await strapiService.getBookings({
        populate: '*',
        pagination: 25
      });

      const mappedData = result.map((item: Guest) => ({
        bookingId: item.documentId?.slice(0, 5) || "-----", 
        name: `${item.customer?.firstName || "Unknown"} ${item.customer?.lastName || ""}`,
        roomType: item.room?.title || "N/A",
        roomNumber: "-", // Use dash as placeholder
        duration: item.nights,
        checkin: item.checkin,
        checkout: item.checkout,
        status: item.book_status || "Pending",
      }));
      
      setData(mappedData);
    };
    fetchData();
  }, []);

  // Optional: badge color function for status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "checked-In":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div 
    className={cn(
      "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className,
    )}
  >     <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Guest List
      </h2>
      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Booking-Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead>Room Number</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>          
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((guest, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={guest.bookingId + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3 !text-left">
                <div>{guest.bookingId}</div>
              </TableCell>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.roomType}</TableCell>
              <TableCell>{guest.roomNumber}</TableCell>
              <TableCell>{guest.duration} night(s)</TableCell>
              <TableCell>{format(new Date(guest.checkin), "dd MMM yyyy")}</TableCell>
              <TableCell>{format(new Date(guest.checkout), "dd MMM yyyy")}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                    guest.status
                  )}`}
                >
                  {guest.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

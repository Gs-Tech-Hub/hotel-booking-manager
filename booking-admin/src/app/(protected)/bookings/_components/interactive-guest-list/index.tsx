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
import UpdateCustomerBooking from "../update-booking-modal";

export function InterActiveGuestList({ className }: { className?: string }) {
  interface Guest {
    documentId: string;
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
    booking_status: string;
    status: string;
  }

  const [data, setData] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await strapiService.getBookings({
        populate: "*",
        pagination: 25,
      });

      const mappedData = result.map((item: Guest) => ({
        bookingId: item.documentId?.slice(0, 5) || "-----",
        name: `${item.customer?.firstName || "Unknown"} ${
          item.customer?.lastName || ""
        }`,
        roomType: item.room?.title || "N/A",
        roomNumber: "-", // Use dash as placeholder
        duration: item.nights,
        checkin: item.checkin,
        checkout: item.checkout,
        status: item.booking_status || "Pending",
        documentId: item.documentId,
      }));

      setData(mappedData);
    };
    fetchData();
  }, []);

  // Optional: badge color function for status
  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "checkedin":
        return "bg-green-100 text-green-600";
      case "checkedout":
        return "bg-blue-100 text-blue-600"
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-700"; // Default to "pending"
    }
  };

  const handleRowClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGuest(null);
  };

  const handleUpdate = async (updatedData: { checkout: string; status: string }) => {
    if (selectedGuest) {
      try {
        await strapiService.updateBooking(selectedGuest.documentId, updatedData);
        setData((prevData) =>
          prevData.map((guest) =>
            guest.documentId === selectedGuest.documentId
              ? { ...guest, ...updatedData }
              : guest
          )
        );
        handleModalClose();
      } catch (error) {
        console.error("Failed to update booking:", error);
      }
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
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
              className="cursor-pointer text-center text-base font-medium text-dark dark:text-white"
              key={guest.bookingId + i}
              onClick={() => handleRowClick(guest)}
            >
              <TableCell className="flex min-w-fit items-center gap-3 !text-left">
                <div>{guest.bookingId}</div>
              </TableCell>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.roomType}</TableCell>
              <TableCell>{guest.roomNumber}</TableCell>
              <TableCell>{guest.duration} night(s)</TableCell>
              <TableCell>
                {format(new Date(guest.checkin), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(guest.checkout), "dd MMM yyyy")}
              </TableCell>
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

      {selectedGuest && (
        <UpdateCustomerBooking
          isOpen={isModalOpen}
          onClose={handleModalClose}
          booking={{
            documentId: selectedGuest.documentId,
            checkin:  selectedGuest.checkin,
            checkout: selectedGuest.checkout,
            status: selectedGuest.status,
            payment: selectedGuest.booking_status,
          }}
          onSubmit={handleUpdate}
          
        />
      )}
    </div>
  );
}

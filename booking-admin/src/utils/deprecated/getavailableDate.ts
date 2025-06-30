/* eslint-disable */

import ApiHandler from "@/utils/dataEndpoint/apiHandler";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

type Booking = {
  checkin: string;
  checkout: string;
};

type CheckAvailabilityInput = {
  roomId: string;
  availableRooms: number;
  startDate: string; // desired check-in
  endDate: string;   // desired check-out
};

function getDateRange(start: Date, end: Date): string[] {
  const date = new Date(start);
  const dates: string[] = [];
  while (date < end) {
    dates.push(date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export async function getRoomsLeft({
  roomId,
  availableRooms,
  startDate,
  endDate,
}: CheckAvailabilityInput): Promise<number | false> {
  try {
    const query = `filters[roomId][$eq]=${roomId}&filters[checkin][$lte]=${endDate}&filters[checkout][$gte]=${startDate}`;
    const result = await apiHandlerInstance.fetchData(`boookings?${query}`);

    const existingBookings: Booking[] = result?.data?.map((b: any) => ({
      checkin: b.checkin,
      checkout: b.checkout,
    })) || [];

    const bookingDayCounts: { [date: string]: number } = {};

    // Track only days with bookings for this room
    existingBookings.forEach((booking) => {
      const bookingDays = getDateRange(new Date(booking.checkin), new Date(booking.checkout));
      bookingDays.forEach((day) => {
        bookingDayCounts[day] = (bookingDayCounts[day] || 0) + 1;
      });
    });

    const targetDays = getDateRange(new Date(startDate), new Date(endDate));
    let minRoomsLeft = availableRooms;

    for (const day of targetDays) {
      const bookedCount = bookingDayCounts[day] || 0;

      if (bookedCount >= availableRooms) {
        return false; // This specific room is fully booked on this day
      }

      const roomsLeft = availableRooms - bookedCount;
      if (roomsLeft < minRoomsLeft) {
        minRoomsLeft = roomsLeft;
      }
    }

    return minRoomsLeft;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return false;
  }
}

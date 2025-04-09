import ApiHandler from "@/utils/apiHandler";

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

function countOverlappingBookings({
  existingBookings,
  startDate,
  endDate,
}: {
  existingBookings: Booking[];
  startDate: string;
  endDate: string;
}): number {
  const targetStart = new Date(startDate);
  const targetEnd = new Date(endDate);

  return existingBookings.filter((booking) => {
    const bookingStart = new Date(booking.checkin);
    const bookingEnd = new Date(booking.checkout);
    return bookingStart < targetEnd && bookingEnd > targetStart;
  }).length;
}

export async function getRoomsLeft({
  roomId,
  availableRooms,
  startDate,
  endDate,
}: CheckAvailabilityInput): Promise<number> {
  try {
    const query = `filters[checkin][$lte]=${endDate}&filters[checkout][$gte]=${startDate}`;
    const result = await apiHandlerInstance.fetchData(`boookings?${query}`);

    const existingBookings: Booking[] = result?.data?.map((b: any) => ({
     roomId: b.roomId,
      checkin: b.checkin,
      checkout: b.checkout,
    })) || [];

    const overlappingCount = countOverlappingBookings({
      existingBookings,
      startDate,
      endDate,
    });

    const roomsLeft = Math.max(availableRooms - overlappingCount, 0);
    console.log('rooms left:', roomsLeft);
    return roomsLeft;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return 0;
  }
}

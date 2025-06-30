/* eslint-disable */
import { Booking } from "@/types/bookingTypes";
import { strapiService } from "@/utils/dataEndpoint";

export async function handleBookingRecords(timeFrame: { startDate: string, endDate: string }) {
  // Ensure startDate and endDate are full-day ISO strings
  const start = new Date(timeFrame.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(timeFrame.endDate);
  end.setHours(23, 59, 59, 999);

  // Fetch booking data with full-day ISO strings
  const bookingData = await strapiService.bookingEndpoints.getBookings({
    populate: "*",
    "pagination[pageSize]": 100,
    "filters[createdAt][$gte]": start.toISOString(),
    "filters[createdAt][$lte]": end.toISOString(),
  });
//  console.log('booking data:', bookingData);
  // Only consider bookings that overlap with the selected date range and have a valid booking_status
  // const filteredBookings = bookingData.filter((booking: Booking) => {
  //   const bookingCheckin = new Date(booking.checkin);
  //   const bookingCheckout = new Date(booking.checkout);
  //   // Booking is considered if it overlaps with the selected range
  //   return (
  //     bookingCheckin.getTime() <= end.getTime() &&
  //     bookingCheckout.getTime() >= start.getTime()
  //   );
  // });

  // console.log('filtered Booking:', filteredBookings)

  // Fetch room data
  const roomData = await strapiService.roomEndpoints.getRooms({ populate: "*" });

  // Count occupied rooms for the selected date
  let occupiedRooms = 0;
  bookingData.forEach((booking: Booking) => {
    if (booking.booking_status === "checkedin") {
      occupiedRooms++;
    }
  });

  // Calculate available rooms by subtracting occupied from total
  const totalAvailableRooms = roomData.reduce((total: number, room: any) => {
    return total + (room.availability || 0);
  }, 0) - occupiedRooms;

  // Count check-ins and check-outs for the selected date range
  let totalCheckIns = 0;
  let totalCheckOuts = 0;
  bookingData.forEach((booking: Booking) => {
    if (booking.booking_status === "checkedin") {
      totalCheckIns++;
    } else if (booking.booking_status === "checkedout") {
      totalCheckOuts++;
    }
  });

  // Payment breakdown (use bookingData for financials)
  const cash = bookingData
    .filter((booking: any) => booking.payment?.paymentMethod === "cash")
    .reduce((total: number, booking: any) => total + (booking.payment?.totalPrice || 0), 0);

  const transfer = bookingData
    .filter((booking: any) =>
      booking.payment?.paymentMethod === "bank_transfer" || booking.payment?.paymentMethod === "card"
    )
    .reduce((total: number, booking: any) => total + (booking.payment?.totalPrice || 0), 0);

  const totalSales = bookingData.reduce((total: number, booking: any) => {
    return total + (booking.payment?.totalPrice || 0);
  }, 0);

  // console.group("Booking Summary");
  // console.log({ totalAvailableRooms, occupiedRooms, totalCheckIns, totalCheckOuts, cash, transfer, totalSales });
  // console.groupEnd();

  return {
    totalAvailableRooms,
    occupiedRooms,
    totalCheckIns,
    totalCheckOuts,
    cash,
    transfer,
    totalSales,
  };
}

/* eslint-disable */
import { Booking } from "@/types/bookingTypes";
import { strapiService } from "./dataEndPoint";

export async function handleBookingRecords(timeFrame: { startDate: string, endDate: string }) {
  // Fetch booking data
  const bookingData = await strapiService.getBookings({
    populate: "*",
    "pagination[pageSize]": 100,
    "filters[createdAt][$gte]": timeFrame.startDate,
    "filters[createdAt][$lte]": timeFrame.endDate,
  });

  console.log("Booking Data:", bookingData);

  // Filter bookings within the last 24 hours
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const filteredBookings = bookingData.filter((booking: Booking) => {
    if (!booking.createdAt) return false;
    const createdAt = new Date(booking.createdAt);
    return createdAt >= last24Hours && createdAt <= now;
  });

  console.log("Filtered Bookings (Last 24 Hours):", filteredBookings);

  // Fetch room data
  const roomData = await strapiService.getRooms({ populate: "*" });

  const totalAvailableRooms = roomData.reduce((total: number, room: any) => {
    return total + (room.availability || 0);
  }, 0);

  let totalCheckIns = 0;
  let totalCheckOuts = 0;
  let occupiedRooms = 0;

  filteredBookings.forEach((booking: Booking) => {
    if (booking.booking_status === "checkedin") {
      totalCheckIns++;
      occupiedRooms++;
    } else if (booking.booking_status === "checkedout") {
      totalCheckOuts++;
    }
  });

  // Payment breakdown
  const cash = filteredBookings
    .filter((booking: Booking) => booking.payment?.paymentMethod === "cash")
    .reduce((total: number, booking: Booking) => total + (booking.totalPrice || 0), 0);

  const transfer = filteredBookings
    .filter((booking: Booking) =>
  booking.payment?.paymentMethod === "bank_transfer" || booking.payment?.paymentMethod === "card"
)
    .reduce((total: number, booking: Booking) => total + (booking.totalPrice || 0), 0);

  const totalSales = filteredBookings.reduce((total: number, booking: Booking) => {
    return total + (booking.totalPrice || 0);
  }, 0);

  console.group("Booking Summary");
  console.log({ totalAvailableRooms, occupiedRooms, totalCheckIns, totalCheckOuts, cash, transfer, totalSales });
  console.groupEnd();

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

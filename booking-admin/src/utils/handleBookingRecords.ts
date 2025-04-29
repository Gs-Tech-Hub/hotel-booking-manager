import { Booking } from "@/types/bookingTypes";
import { strapiService } from "./dataEndPoint";

// Define and export the function to summarize booking data
export async function handleBookingRecords(timeFrame: { startDate: string, endDate: string }) {
    // Fetch booking data
    const bookingData = await strapiService.getBookings({
      populate: "*",
      "pagination[pageSize]": 70,
      "filters[createdAt][$gte]": timeFrame.startDate,
      "filters[createdAt][$lte]": timeFrame.endDate,
    });
  
    console.log("Booking Data:", bookingData);
  
    // Initialize aggregated data structure
    const aggregatedData = {
      hotel: { total: 0, cash: 0, online: 0, debt: 0 },
    };
  
    // Process the booking data to calculate total room values and payment methods
    if (Array.isArray(bookingData)) {
      bookingData.forEach((booking: Booking) => {
        // Get room price, nights, and calculate total room price
        const roomPrice: number = booking.room?.price || 0;
        const nights: number = booking.nights || 0;
        const totalRoomPrice: number = roomPrice * nights;
  
        // Determine the payment status and method
        const paymentStatus: string = booking.payment?.PaymentStatus || "debt";
        const paymentMethod = (booking.payment?.paymentMethod || "cash") as "cash" | "online";
  
        // Add total to hotel aggregation
        aggregatedData.hotel.total += totalRoomPrice;
  
        // Track payments based on status
        if (paymentStatus === "success") {
          aggregatedData.hotel[paymentMethod] += totalRoomPrice;
        } else {
          aggregatedData.hotel.debt += totalRoomPrice;
        }
      });
    } else {
      console.warn("No booking data available or invalid format.");
    }
  
    console.log("Aggregated Hotel Data:", aggregatedData);
  
    return aggregatedData;
}

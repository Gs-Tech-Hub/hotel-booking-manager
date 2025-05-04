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
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const filteredBookings = bookingData.filter((booking: Booking) => {
        if (!booking.createdAt) return false;
        const createdAt = new Date(booking.createdAt);
        return createdAt >= last24Hours && createdAt <= now;
    });

    console.log("Filtered Bookings (Last 24 Hours):", filteredBookings);

    const roomData = await strapiService.getRooms({ populate: "*" });

    const totalAvailableRooms = roomData.reduce((total: number, room: any) => {
        return total + (room.availability || 0);
    }, 0);

    const occupiedRooms = filteredBookings.filter((booking: Booking) => booking.booking_status === "checkedin").length;

    const totalCheckIns = filteredBookings.filter((booking: Booking) => booking.booking_status === "checkedin").length;
    const totalCheckOuts = filteredBookings.filter((booking: Booking) => booking.booking_status === "checkedout").length;

    console.log("Total Available Rooms:", totalAvailableRooms);
    console.log("Occupied Rooms:", occupiedRooms);
    console.log("Total Check-Ins:", totalCheckIns);
    console.log("Total Check-Outs:", totalCheckOuts);

    return {
        totalAvailableRooms,
        occupiedRooms,
        totalCheckIns,
        totalCheckOuts,
    };
}

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE BOOKING
export const createBooking = async (data: Prisma.boookingsCreateInput) => {
  return await prisma.boookings.create({ data });
};

// GET ALL BOOKINGS WITH PAGINATION
export const getAllBookings = async (page: number = 1, pageSize: number = 10) => {
  try {
    const bookings = await prisma.boookings.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        boookings_room_lnk: true,
      },
    });

    const totalBookings = await prisma.boookings.count();
    return { bookings, totalPages: Math.ceil(totalBookings / pageSize) };
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw new Error("Failed to fetch all bookings");
  }
};

// UPDATE BOOKING
export const updateBooking = async (id: number, data: Prisma.boookingsUpdateInput) => {
  return await prisma.boookings.update({ where: { id }, data });
};

// DELETE BOOKING
export const deleteBooking = async (id: number) => {
  return await prisma.boookings.delete({ where: { id } });
};

// GET AVAILABLE ROOMS WITH PAGINATION
export const getAvailableRooms = async () => {
    const today = new Date();
    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(today.getDate() + 90);
  
    try {
      // 🔹 Get all rooms
      const allRooms = await prisma.rooms.findMany({
        select: { id: true, title: true },
      });
  
      // 🔹 Get bookings within the next 90 days
      const bookings = await prisma.boookings.findMany({
        where: {
          OR: [
            { checkin: { gte: today, lte: ninetyDaysLater } },
            { checkout: { gte: today, lte: ninetyDaysLater } },
          ],
        },
        select: {
          checkin: true,
          checkout: true,
          boookings_room_lnk: { select: { room_id: true } },
        },
      });
  
      // 🔹 Organize bookings by room
      const bookedRooms: Record<number, { checkin: Date; checkout: Date }[]> = {};
  
      bookings.forEach(({ checkin, checkout, boookings_room_lnk }) => {
        if (!checkin || !checkout) return;
        boookings_room_lnk.forEach(({ room_id }) => {
          if (!room_id) return;
          if (!bookedRooms[room_id]) bookedRooms[room_id] = [];
          bookedRooms[room_id].push({ checkin: new Date(checkin), checkout: new Date(checkout) });
        });
      });
  
      // 🔹 Compute available date ranges
      const availableRooms = allRooms.map((room) => {
        const bookings = bookedRooms[room.id] || [];
        bookings.sort((a, b) => a.checkin.getTime() - b.checkin.getTime()); // Sort by check-in date
  
        let availableDates = [];
        let lastCheckout = today;
  
        for (const { checkin, checkout } of bookings) {
          if (lastCheckout < checkin) {
            availableDates.push({ from: lastCheckout, to: new Date(checkin) });
          }
          lastCheckout = checkout > lastCheckout ? checkout : lastCheckout;
        }
  
        if (lastCheckout < ninetyDaysLater) {
          availableDates.push({ from: lastCheckout, to: ninetyDaysLater });
        }
  
        return { ...room, availableDates };
      });
  
      console.log("Available rooms with dates:", availableRooms); // Debugging output
      return availableRooms;
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      throw new Error("Failed to fetch available rooms");
    }
  };

  export const getAvailableRoom = async (roomId: number) => {
    const today = new Date();
    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(today.getDate() + 90);
  
    try {
      // 🔹 Check if the room exists
      const room = await prisma.rooms.findUnique({
        where: { id: roomId },
        select: { id: true, title: true },
      });
  
      if (!room) {
        throw new Error("Room not found");
      }
  
      // 🔹 Fetch bookings for this room in the next 90 days
      const bookings = await prisma.boookings.findMany({
        where: {
          boookings_room_lnk: {
            some: { room_id: roomId },
          },
          OR: [
            { checkin: { gte: today, lte: ninetyDaysLater } },
            { checkout: { gte: today, lte: ninetyDaysLater } },
          ],
        },
        select: { checkin: true, checkout: true },
      });
  
      // 🔹 Sort bookings by check-in date
      bookings.sort((a, b) => {
        if (!a.checkin || !b.checkin) return 0;
        return a.checkin.getTime() - b.checkin.getTime();
      });
  
      // 🔹 Generate availability for the next 90 days
      let availableDates: { date: string; available: boolean }[] = [];
      let currentDate = new Date(today);
      let bookedDates = new Set();
  
      // 🔹 Mark booked days
      for (const { checkin, checkout } of bookings) {
        if (!checkin || !checkout) continue;
        let tempDate = new Date(checkin);
        while (tempDate <= checkout) {
          bookedDates.add(tempDate.toISOString().split("T")[0]); // Store as "YYYY-MM-DD"
          tempDate.setDate(tempDate.getDate() + 1);
        }
      }
  
      // 🔹 Populate the 90-day structure
      while (currentDate <= ninetyDaysLater) {
        const dateStr = currentDate.toISOString().split("T")[0];
        availableDates.push({ date: dateStr, available: !bookedDates.has(dateStr) });
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      console.log("Available dates for room:", roomId, availableDates); // Debugging
      return { ...room, availableDates };
    } catch (error) {
      console.error("Error fetching available dates for room:", error);
      throw new Error("Failed to fetch available dates");
    }
  };
  
// GET UNAVAILABLE DATES (FIXED NULL DATE TYPE ISSUE)
export const getUnavailableDates = async () => {
  const today = new Date();
  const ninetyDaysLater = new Date();
  ninetyDaysLater.setDate(today.getDate() + 90);

  const bookings = await prisma.boookings.findMany({
    where: {
      OR: [
        { checkin: { gte: today, lte: ninetyDaysLater } },
        { checkout: { gte: today, lte: ninetyDaysLater } },
      ],
    },
    select: {
      checkin: true,
      checkout: true,
      boookings_room_lnk: {
        select: { room_id: true },
      },
    },
  });

  // 🔹 Convert `null` checkin/checkout to valid Date
  return bookings.reduce((acc, { checkin, checkout, boookings_room_lnk }) => {
    if (!checkin || !checkout) return acc; // 🔹 Skip null values

    boookings_room_lnk.forEach(({ room_id }) => {
      if (!room_id) return;
      if (!acc[room_id]) acc[room_id] = [];
      acc[room_id].push({ checkin: new Date(checkin), checkout: new Date(checkout) });
    });

    return acc;
  }, {} as Record<number, { checkin: Date; checkout: Date }[]>);
};

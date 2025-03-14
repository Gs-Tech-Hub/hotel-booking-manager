import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch all rooms with related data
export const getAllRooms = async () => {
  return await prisma.rooms.findMany({
    include: {
      rooms_amenities_lnk: {
        include: { amenities: true },
      },
      rooms_bed_lnk: {
        include: { beds: true },
      },
      boookings_room_lnk: {
        include: { boookings: true },
      },
    },
  });
};

// ✅ Fetch single room by ID with details
export const getRoomById = async (roomId: number) => {
  return await prisma.rooms.findUnique({
    where: { id: roomId },
    include: {
      rooms_amenities_lnk: {
        include: { amenities: true },
      },
      rooms_bed_lnk: {
        include: { beds: true },
      },
      boookings_room_lnk: {
        include: { boookings: true },
      },
    },
  });
};

// ✅ Fetch available rooms (not booked in the next 90 days)
export const getAvailableRooms = async () => {
  const today = new Date();
  const ninetyDaysLater = new Date();
  ninetyDaysLater.setDate(today.getDate() + 90);

  return await prisma.rooms.findMany({
    where: {
      boookings_room_lnk: {
        none: {
          boookings: {
            OR: [
              { checkin: { gte: today, lte: ninetyDaysLater } },
              { checkout: { gte: today, lte: ninetyDaysLater } },
            ],
          },
        },
      },
    },
    include: {
      rooms_amenities_lnk: {
        include: { amenities: true },
      },
      rooms_bed_lnk: {
        include: { beds: true },
      },
    },
  });
};

// ✅ Fetch unavailable dates for a specific room
// export const getUnavailableDates = async (roomId: number) => {
//   const today = new Date();
//   const ninetyDaysLater = new Date();
//   ninetyDaysLater.setDate(today.getDate() + 90);

//   const bookings = await prisma.boookings_room_lnk.findMany({
//     where: {
//       room_id: roomId,
//       boookings: {
//         OR: [
//           { checkin: { gte: today, lte: ninetyDaysLater } },
//           { checkout: { gte: today, lte: ninetyDaysLater } },
//         ],
//       },
//     },
//     select: {
//       boookings: {
//         select: { checkin: true, checkout: true },
//       },
//     },
//   });

//   return bookings.map(({ boookings }) => ({
//     checkin: boookings?.checkin,
//     checkout: boookings?.checkout,
//   }));
// };

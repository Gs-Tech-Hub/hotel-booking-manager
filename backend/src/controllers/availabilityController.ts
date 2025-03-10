
// import { PrismaClient} from '@prisma/client';

// const prisma = new PrismaClient();

// import { Request, Response } from "express";


// export const getAvailableRooms = async (req: Request, res: Response) => {
//   try {
//     const { checkIn, checkOut } = req.query;

//     if (!checkIn || !checkOut) {
//       return res.status(400).json({ message: "Check-in and check-out dates are required." });
//     }

//     const checkInDate = new Date(checkIn as string);
//     const checkOutDate = new Date(checkOut as string);

//     // Find booked rooms within the given period
//     const bookedRooms: { roomId: string }[] = await prisma.boookings.findMany({
//       where: {
//         OR: [
//           { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } }
//         ]
//       },
//       select: { roomId: true }
//     });

//     const bookedRoomIds = bookedRooms.map((booking: { roomId: string }) => booking.roomId);

//     // Find available rooms that are NOT booked
//     const availableRooms = await prisma.rooms.findMany({
//       where: {
//         id: { notIn: bookedRoomIds }
//       }
//     });

//     res.json({ availableRooms });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching available rooms", error });
//   }
// };

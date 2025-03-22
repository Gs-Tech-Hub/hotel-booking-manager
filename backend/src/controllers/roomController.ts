import { Request, Response } from "express";
import * as roomService from "../services/roomService";

// Create a new room
// export const createRoom = async (req: Request, res: Response) => {
//   try {
//     const room = await roomService.createRoom(req.body);
//     res.status(201).json(room);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating room", error });
//   }
// };

// Get all rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

// Get room by ID
export const getRoomById = async (req: Request, res: Response) : Promise<void> => {
    try {
      const id = Number(req.params.id);
    const room = await roomService.getRoomById(id);
    room ? res.json(room) : res.status(404).json({ message: "Room not found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error });
  }
};

// Update room
// export const updateRoom = async (req: Request, res: Response) => {
//   try {
//     const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
//     res.json(updatedRoom);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating room", error });
//   }
// };

// Delete room
// export const deleteRoom = async (req: Request, res: Response) => {
//   try {
//     await roomService.deleteRoom(req.params.id);
//     res.json({ message: "Room deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting room", error });
//   }
// };

// Get available rooms for a specific room with 90-day available dates
// export const getAvailableRoomById = async (req: Request, res: Response) : Promise<void> => {
//     try {
//     const id = Number(req.params.id);
//     const availableRoom = await roomService.getAvailableRoomById(id);
//     res.json(availableRoom);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching available room", error });
//   }
// };

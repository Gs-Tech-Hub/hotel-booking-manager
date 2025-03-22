import { Router } from "express";
import * as roomController from "../controllers/roomController";

const router = Router();

// Create a new room
// router.post("/", roomController.createRoom);

// Get all rooms
router.get("/", roomController.getAllRooms);

// Get a single room by ID
router.get("/:id", roomController.getRoomById);

// Update a room
// router.put("/:id", roomController.updateRoom);

// Delete a room
// router.delete("/:id", roomController.deleteRoom);

// Get available dates for a specific room
// router.get("/:id/available", roomController.getAvailableRoomById);

export default router;

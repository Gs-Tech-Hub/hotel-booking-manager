import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    // Extract pagination parameters with default values
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const bookings = await bookingService.getAllBookings(page, limit);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid booking ID" });
      return; // ✅ Ensure function does not proceed further
    }

    const updatedBooking = await bookingService.updateBooking(id, req.body);
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};


export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id); // ✅ Convert ID to number
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid booking ID" });
      return; // ✅ Stop further execution
    }

    const deletedBooking = await bookingService.deleteBooking(id);
    
    if (!deletedBooking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(204).send(); // ✅ No Content (Recommended for DELETE)
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking", error });
  }
};


// Get available rooms with pagination
export const getAvailableRooms = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const availableRooms = await bookingService.getAvailableRooms();
    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching available rooms" });
  }
};

// Get available room by ID
export const getAvailableRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = parseInt(req.params.roomId, 10); // Ensure base 10 parsing

    if (isNaN(roomId)) {
      res.status(400).json({ message: "Invalid room ID" });
      return; // ✅ Prevent further execution
    }

    const availableDates = await bookingService.getAvailableRoom(roomId);
    res.json(availableDates);
  } catch (error) {
    console.error("Error fetching available dates:", error);
    res.status(500).json({ message: "Error fetching available dates", error });
  }
};


export const getUnavailableDates = async (req: Request, res: Response) => {
    try {
      const unavailableDates = await bookingService.getUnavailableDates();
      res.json(unavailableDates);
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
      res.status(500).json({ message: "Error fetching unavailable dates", error });
    }
  };
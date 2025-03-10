import { Router, Request, Response } from "express";
import * as bookingController from "../controllers/bookingController";

const router = Router(); //Use Express Router

router.post("/bookings", bookingController.createBooking);
router.get("/bookings", bookingController.getAllBookings);
router.put("/bookings/:id", bookingController.updateBooking);
router.delete("/bookings/:id", bookingController.deleteBooking);
router.get("/available-rooms", bookingController.getAvailableRooms);
router.get("/available-room/:roomId", bookingController.getAvailableRoom);
router.get("/unavailable-dates", bookingController.getUnavailableDates);


export default router;

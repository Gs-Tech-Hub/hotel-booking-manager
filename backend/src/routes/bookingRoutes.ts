import { Router, Request, Response } from "express";
import * as bookingController from "../controllers/bookingController";

const router = Router(); //Use Express Router

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);
router.get("/available-rooms", bookingController.getAvailableRooms);
router.get("/available-room/:roomId", bookingController.getAvailableRoom);
router.get("/unavailable-dates", bookingController.getUnavailableDates);


export default router;

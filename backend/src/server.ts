import dotenv from "dotenv";

import express, { Request, Response } from "express"; // Import Request
import bookingRoutes from "./routes/bookingRoutes";
import roomRoutes from "./routes/roomRoutes"; 

dotenv.config();
const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix: Add Request parameter
app.get("/", (req: Request, res: Response) => {
   res.json({ msg: "Hello, World!" });
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes); // Include roomRoutes


app.listen(port, () => {
   console.log(`🚀 Server is running on port ${port}`);
});


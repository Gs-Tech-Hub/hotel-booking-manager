import express, { Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (res: Response) => {
   res.json({ msg: "Hello, World!" });
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

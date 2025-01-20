import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import colors from "colors";
import morgan from "morgan";
import { connectDB } from "./db/dbConn.js";
import locationRouter from "./routers/locationRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();
config();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/auth", userRouter);

connectDB();

export default app;

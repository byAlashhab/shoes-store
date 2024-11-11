import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./db/db.js";
import authRouter from "./route/auth.route.js";
import userRouter from "./route/user.route.js";
import agentRouter from "./route/agent.route.js";
import orderRouter from "./route/order.route.js";
import shoesRouter from "./route/shoes.route.js";
import cors from "cors";
import { isAuthenticated } from "./middleware/isAuthenticated.js";
import { isAdmin } from "./middleware/isAdmin.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const allowedOrigins = [
  "http://localhost:5173", // Vite
  "http://localhost:5174", // Portal
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  } else {
    console.error(err);
  }
});

app.use("/auth", authRouter);
app.use("/user", isAuthenticated, userRouter);
app.use("/agent", isAuthenticated, isAdmin, agentRouter);
app.use("/orders", isAuthenticated, orderRouter);
app.use("/shoes", isAuthenticated, shoesRouter);

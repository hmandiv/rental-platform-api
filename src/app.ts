import express from "express";
import cors from "cors";

import { requestLogger } from "./middlewares/requestLogger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://simple-lease.vercel.app",
  "https://www.directrent.ca",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools like curl/Postman with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Rental Platform API running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/AppError";
import apiRoutes from "./routes";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Mount Routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/bookings", bookingRoutes);
  app.use("/api/v1/payment", paymentRoutes);

  // API Routes will be mounted here
  app.use("/api/v1", apiRoutes);

  // Handle unhandled routes
  app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

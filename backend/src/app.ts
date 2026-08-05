import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/AppError";
import apiRoutes from "./routes";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import queryRoutes from "./routes/query.routes";
import visitorRoutes from "./routes/visitor.routes";
import notificationRoutes from "./routes/notification.routes";
import paymentRoutes from "./routes/payment.routes";
import eventRoutes from "./routes/event.routes";

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "https://divyam-psi.vercel.app",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
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
  app.use("/api/v1/events", eventRoutes);
  app.use("/api/v1/payment", paymentRoutes);
  app.use("/api/v1/queries", queryRoutes);
  app.use("/api/v1/visitors", visitorRoutes);
  app.use("/api/v1/notifications", notificationRoutes);

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

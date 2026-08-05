"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const AppError_1 = require("./utils/AppError");
const routes_1 = __importDefault(require("./routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const query_routes_1 = __importDefault(require("./routes/query.routes"));
const visitor_routes_1 = __importDefault(require("./routes/visitor.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    if (process.env.NODE_ENV === "development") {
        app.use((0, morgan_1.default)("dev"));
    }
    // Health check
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
    });
    // Mount Routes
    app.use("/api/v1/auth", auth_routes_1.default);
    app.use("/api/v1/bookings", booking_routes_1.default);
    app.use("/api/v1/events", event_routes_1.default);
    app.use("/api/v1/payment", payment_routes_1.default);
    app.use("/api/v1/queries", query_routes_1.default);
    app.use("/api/v1/visitors", visitor_routes_1.default);
    app.use("/api/v1/notifications", notification_routes_1.default);
    // API Routes will be mounted here
    app.use("/api/v1", routes_1.default);
    // Handle unhandled routes
    app.all("/*splat", (req, res, next) => {
        next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
    // Global Error Handler
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;

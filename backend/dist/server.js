"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await (0, db_1.connectDB)();
        // 2. Start Express app
        const app = (0, app_1.createApp)();
        const port = env_1.env.PORT || 5000;
        const server = app.listen(port, () => {
            console.log(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${port}`);
        });
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();

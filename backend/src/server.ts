import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express app
    const app = createApp();
    
    const port = env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

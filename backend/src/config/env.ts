import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "MongoDB URI is required"),
  JWT_SECRET: z.string().min(10, "JWT secret must be at least 10 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:", (error as any).errors);
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

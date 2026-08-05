"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().default("5000"),
    MONGO_URI: zod_1.z.string().min(1, "MongoDB URI is required"),
    JWT_SECRET: zod_1.z.string().min(10, "JWT secret must be at least 10 characters long"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
});
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("❌ Environment validation failed:", error.errors);
            process.exit(1);
        }
        throw error;
    }
};
exports.env = parseEnv();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Middleware to validate incoming requests against a Zod schema.
 * Validates body, query and params without mutating readonly Express properties.
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Update only writable properties
            if (validatedData.body) {
                req.body = validatedData.body;
            }
            if (validatedData.params) {
                req.params = validatedData.params;
            }
            // ❌ DO NOT DO THIS IN EXPRESS 5
            // req.query = validatedData.query;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: error.issues.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;

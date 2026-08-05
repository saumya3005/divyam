import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate incoming requests against a Zod schema.
 * Validates body, query and params without mutating readonly Express properties.
 */
export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData: any = await schema.parseAsync({
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

    } catch (error) {

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: (error as any).issues.map((e: any) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(error);
    }
  };
};
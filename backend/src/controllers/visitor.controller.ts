import { Request, Response, NextFunction } from "express";
import { Visitor } from "../models/Visitor";

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, path } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID required" });
    }

    // Try to insert, ignore duplicate key errors (since we only care about unique sessions)
    try {
      await Visitor.create({ sessionId, path });
    } catch (err: any) {
      if (err.code !== 11000) {
        throw err;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

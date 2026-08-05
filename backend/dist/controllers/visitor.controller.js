"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackVisitor = void 0;
const Visitor_1 = require("../models/Visitor");
const trackVisitor = async (req, res, next) => {
    try {
        const { sessionId, path } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID required" });
        }
        // Try to insert, ignore duplicate key errors (since we only care about unique sessions)
        try {
            await Visitor_1.Visitor.create({ sessionId, path });
        }
        catch (err) {
            if (err.code !== 11000) {
                throw err;
            }
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.trackVisitor = trackVisitor;

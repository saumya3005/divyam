"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Employee_1 = require("../models/Employee");
const Inventory_1 = require("../models/Inventory");
const Approval_1 = require("../models/Approval");
const Customer_1 = require("../models/Customer");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.get("/employees", async (req, res) => {
    try {
        const employees = await Employee_1.Employee.find().sort({ createdAt: -1 });
        res.json({ success: true, data: employees });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});
router.get("/inventory", async (req, res) => {
    try {
        const items = await Inventory_1.Inventory.find().sort({ createdAt: -1 });
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});
router.get("/approvals", async (req, res) => {
    try {
        const approvals = await Approval_1.Approval.find().sort({ createdAt: -1 });
        res.json({ success: true, data: approvals });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});
router.get("/customers", async (req, res) => {
    try {
        const customers = await Customer_1.Customer.find().sort({ createdAt: -1 });
        res.json({ success: true, data: customers });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});
router.get("/users", async (req, res) => {
    try {
        const users = await User_1.User.find().sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});
exports.default = router;

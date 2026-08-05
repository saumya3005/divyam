import { Router } from "express";
import { Employee } from "../models/Employee";
import { Inventory } from "../models/Inventory";
import { Approval } from "../models/Approval";
import { Customer } from "../models/Customer";
import { User } from "../models/User";

const router = Router();

router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/inventory", async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/approvals", async (req, res) => {
  try {
    const approvals = await Approval.find().sort({ createdAt: -1 });
    res.json({ success: true, data: approvals });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;

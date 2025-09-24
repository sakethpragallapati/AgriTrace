// agritech/backend/auth.js
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const SECRET = process.env.JWT_SECRET;

const farmerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  transferredProduces: [{ type: String }]
});

const distributorSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

const retailerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

export const Farmer = mongoose.model("Farmer", farmerSchema);
const Distributor = mongoose.model("Distributor", distributorSchema);
const Retailer = mongoose.model("Retailer", retailerSchema);

export async function register(req, res) {
  const { phone, password, role } = req.body;
  console.log("Received body:", req.body); // 👈 check what Postman sends
  console.log("Role received:", role);
  if (!["farmer", "distributor", "retailer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be exactly 10 digits" });
  }

  try {
    const existingFarmer = await Farmer.findOne({ phone });
    const existingDistributor = await Distributor.findOne({ phone });
    const existingRetailer = await Retailer.findOne({ phone });
    if (existingFarmer || existingDistributor || existingRetailer) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = bcrypt.hashSync(password, 8);

    if (role === "farmer") {
      const newFarmer = new Farmer({ phone, password: hashed, role, transferredProduces: [] });
      await newFarmer.save();
    } else if (role === "distributor") {
      const newDistributor = new Distributor({ phone, password: hashed, role });
      await newDistributor.save();
    } else if (role === "retailer") {
      const newRetailer = new Retailer({ phone, password: hashed, role });
      await newRetailer.save();
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  const { phone, password } = req.body;

  try {
    let user = await Farmer.findOne({ phone });
    let userRole = "farmer";

    if (!user) {
      user = await Distributor.findOne({ phone });
      userRole = "distributor";
    }

    if (!user) {
      user = await Retailer.findOne({ phone });
      userRole = "retailer";
    }

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ phone: user.phone, role: userRole }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export function logout(req, res) {
  res.json({ message: "Logged out" });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function getRoleByPhone(phone) {
  try {
    if (await Farmer.findOne({ phone })) return "farmer";
    if (await Distributor.findOne({ phone })) return "distributor";
    if (await Retailer.findOne({ phone })) return "retailer";
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
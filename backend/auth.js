import dotenv from 'dotenv';
dotenv.config();

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import twilio from "twilio";

const SECRET = process.env.JWT_SECRET;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
const otpStore = new Map(); // In-memory OTP store (use Redis in production)

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

const farmerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  transferredProduces: [{ type: String }]
});

const distributorSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  role: { type: String, required: true }
});

const retailerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  role: { type: String, required: true }
});

export const Farmer = mongoose.model("Farmer", farmerSchema);
const Distributor = mongoose.model("Distributor", distributorSchema);
const Retailer = mongoose.model("Retailer", retailerSchema);

export async function register(req, res) {
  const { phone, role } = req.body;
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

    const otp = generateOtp();
    otpStore.set(phone, { otp, role, expires: Date.now() + 5 * 60 * 1000 }); // OTP expires in 5 minutes

    await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: `+91${phone}` // Assuming Indian phone numbers; adjust country code as needed
    });

    res.json({ message: "OTP sent to phone" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
}

export async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be exactly 10 digits" });
  }

  try {
    let userRole = await getRoleByPhone(phone);
    if (!userRole) {
      return res.status(400).json({ error: "User not found. Please register first." });
    }

    const otp = generateOtp();
    otpStore.set(phone, { otp, role: userRole, expires: Date.now() + 5 * 60 * 1000 });

    await client.messages.create({
      body: `Your OTP for login is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: `+91${phone}` // Adjust country code as needed
    });

    res.json({ message: "OTP sent to phone" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
}

export async function verifyOtp(req, res) {
  const { phone, otp } = req.body;

  try {
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (!await getRoleByPhone(phone)) {
      if (stored.role === "farmer") {
        const newFarmer = new Farmer({ phone, role: stored.role, transferredProduces: [] });
        await newFarmer.save();
      } else if (stored.role === "distributor") {
        const newDistributor = new Distributor({ phone, role: stored.role });
        await newDistributor.save();
      } else if (stored.role === "retailer") {
        const newRetailer = new Retailer({ phone, role: stored.role });
        await newRetailer.save();
      }
    }

    const token = jwt.sign({ phone, role: stored.role }, SECRET, { expiresIn: "1h" });
    otpStore.delete(phone); // Clear OTP after use
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
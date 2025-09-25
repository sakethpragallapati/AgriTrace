import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createActor } from "./ic-agent.js";
import { register, sendOtp, verifyOtp, logout, authMiddleware, getRoleByPhone, Farmer } from "./auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const canister = createActor();

function stringifyBigInts(obj) {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(stringifyBigInts);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, stringifyBigInts(value)])
    );
  } else {
    return obj;
  }
}

// ---------- AUTH ROUTES ----------
app.post("/register", register);
app.post("/send-otp", sendOtp);
app.post("/verify-otp", verifyOtp);
app.post("/logout", logout);

// ---------- FARMER ROUTES ----------
app.post("/farmer/addProduce", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer")
    return res.status(403).json({ error: "Access denied" });

  try {
    const { produceType, origin, quality, price } = req.body;

    if (!produceType || !origin || !quality || !price)
      return res.status(400).json({ error: "Missing fields" });

    let priceBigInt;
    try {
      priceBigInt = BigInt(price);
    } catch {
      return res.status(400).json({ error: "Invalid price" });
    }

    const result = await canister.addProduce(
      produceType,
      origin,
      quality,
      priceBigInt,
      req.user.phone
    );

    const safeResult = stringifyBigInts(result);
    res.json(safeResult);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/farmer/transferProduce", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer")
    return res.status(403).json({ error: "Access denied" });

  try {
    const { id, newOwner, details, newPrice } = req.body;

    if (!id || !newOwner || !details || !newPrice)
      return res.status(400).json({ error: "Missing fields" });

    const newOwnerRole = await getRoleByPhone(newOwner);
    if (!newOwnerRole) return res.status(400).json({ error: "New owner not found" });
    if (newOwnerRole !== "distributor") return res.status(400).json({ error: "Can only transfer to distributor" });

    let idBigInt, newPriceBigInt;
    try {
      idBigInt = BigInt(id);
      newPriceBigInt = BigInt(newPrice);
    } catch {
      return res.status(400).json({ error: "Invalid id or price" });
    }

    const result = await canister.transferProduce(
      idBigInt,
      req.user.phone,
      newOwner,
      details,
      newPriceBigInt
    );
    const safeResult = stringifyBigInts(result);

    if (result.ok) {
      const farmer = await Farmer.findOne({ phone: req.user.phone });
      if (farmer) {
        farmer.transferredProduces.push(idBigInt.toString());
        await farmer.save();
      }
    }

    res.json(safeResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/farmer/produces", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer")
    return res.status(403).json({ error: "Access denied" });

  try {
    const result = await canister.getProducesByOwner(req.user.phone);
    const safeResult = stringifyBigInts(result);
    res.json(safeResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/farmer/transferredProduces", authMiddleware, async (req, res) => {
  if (req.user.role !== "farmer")
    return res.status(403).json({ error: "Access denied" });

  try {
    const farmer = await Farmer.findOne({ phone: req.user.phone });
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    const transferredIds = farmer.transferredProduces;
    const traces = [];

    for (const idStr of transferredIds) {
      const idBigInt = BigInt(idStr);
      const trace = await canister.getProduceTrace(idBigInt);
      if (trace) {
        const safeTrace = stringifyBigInts(trace);
        traces.push(safeTrace);
      }
    }

    res.json(traces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- DISTRIBUTOR ROUTES ----------
app.post("/distributor/transferProduce", authMiddleware, async (req, res) => {
  if (req.user.role !== "distributor")
    return res.status(403).json({ error: "Access denied" });

  try {
    const { id, newOwner, details, newPrice } = req.body;

    if (!id || !newOwner || !details || !newPrice)
      return res.status(400).json({ error: "Missing fields" });

    const newOwnerRole = await getRoleByPhone(newOwner);
    if (!newOwnerRole) return res.status(400).json({ error: "New owner not found" });
    if (newOwnerRole !== "retailer") return res.status(400).json({ error: "Can only transfer to retailer" });

    let idBigInt, newPriceBigInt;
    try {
      idBigInt = BigInt(id);
      newPriceBigInt = BigInt(newPrice);
    } catch {
      return res.status(400).json({ error: "Invalid id or price" });
    }

    const result = await canister.transferProduce(
      idBigInt,
      req.user.phone,
      newOwner,
      details,
      newPriceBigInt
    );
    const safeResult = stringifyBigInts(result);
    res.json(safeResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/distributor/produces", authMiddleware, async (req, res) => {
  if (req.user.role !== "distributor")
    return res.status(403).json({ error: "Access denied" });

  try {
    const result = await canister.getProducesByOwner(req.user.phone);
    const safeResult = stringifyBigInts(result);
    res.json(safeResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- RETAILER ROUTES ----------
app.get("/retailer/produces", authMiddleware, async (req, res) => {
  if (req.user.role !== "retailer")
    return res.status(403).json({ error: "Access denied" });

  try {
    const result = await canister.getProducesByOwner(req.user.phone);
    const safeResult = stringifyBigInts(result);
    res.json(safeResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- CONNECT TO MONGODB AND START SERVER ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(3000, () => {
      console.log("🚀 Backend running at http://localhost:3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
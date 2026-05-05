/*
 * FinPilot Lite — Backend Server
 * ================================
 * Express.js API server with Supabase integration.
 *
 * DATABASE SETUP (run in your Supabase SQL editor):
 * --------------------------------------------------
 *
 * -- portfolio table
 * CREATE TABLE portfolio (
 *   id SERIAL PRIMARY KEY,
 *   asset TEXT NOT NULL,
 *   quantity NUMERIC NOT NULL,
 *   buy_price NUMERIC NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- transactions table
 * CREATE TABLE transactions (
 *   id SERIAL PRIMARY KEY,
 *   asset TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   quantity NUMERIC NOT NULL,
 *   price NUMERIC NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors()); // Allow all origins
app.use(express.json());

// ─── Supabase Client ─────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ─── Mock Price Data ─────────────────────────────────────────────────────────
const MOCK_PRICES = {
  BTC: { price: 67000.00, change: 2.4 },
  ETH: { price: 3500.00, change: -1.2 },
  USDT: { price: 1.00, change: 0.01 },
  BNB: { price: 590.00, change: 1.5 },
  SOL: { price: 145.00, change: 4.2 },
  USDC: { price: 1.00, change: 0.00 },
  XRP: { price: 0.62, change: -0.5 },
  DOGE: { price: 0.15, change: 5.1 },
  TON: { price: 6.80, change: 2.2 },
  ADA: { price: 0.45, change: -1.1 },
  // Keep your existing stocks too!
  AAPL: { price: 189.00, change: 0.8 },
  TSLA: { price: 248.00, change: -0.5 },
  RELIANCE: { price: 2950.00, change: 1.1 },
  INFY: { price: 1780.00, change: 0.3 }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/prices
 * Returns mock market prices for supported assets.
 */
app.get("/api/prices", (req, res) => {
  res.json(MOCK_PRICES);
});

/**
 * POST /api/portfolio
 * Adds a new holding to the portfolio.
 * Body: { asset, quantity, buy_price }
 */
app.post("/api/portfolio", async (req, res) => {
  const { asset, quantity, buy_price } = req.body;

  if (!asset || quantity == null || buy_price == null) {
    return res.status(400).json({ error: "asset, quantity, and buy_price are required." });
  }

  const { data, error } = await supabase
    .from("portfolio")
    .insert([{ asset: asset.toUpperCase(), quantity, buy_price }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/portfolio
 * Returns all portfolio holdings, ordered by creation date.
 */
app.get("/api/portfolio", async (req, res) => {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * DELETE /api/portfolio/:id
 * Removes a portfolio holding by its ID.
 */
app.delete("/api/portfolio/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("portfolio")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, deleted_id: id });
});

/**
 * POST /api/trade
 * Records a simulated buy or sell trade.
 * Body: { asset, type, quantity, price }
 */
app.post("/api/trade", async (req, res) => {
  const { asset, type, quantity, price } = req.body;

  if (!asset || !type || quantity == null || price == null) {
    return res.status(400).json({ error: "asset, type, quantity, and price are required." });
  }

  if (!["buy", "sell"].includes(type.toLowerCase())) {
    return res.status(400).json({ error: "type must be 'buy' or 'sell'." });
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert([{ asset: asset.toUpperCase(), type: type.toLowerCase(), quantity, price }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/trades
 * Returns all trade history, most recent first.
 */
app.get("/api/trades", async (req, res) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "FinPilot Lite API", version: "1.0.0" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 FinPilot Lite API running on http://localhost:${PORT}`);
  console.log(`   Supabase URL: ${process.env.SUPABASE_URL || "(not set)"}\n`);
});

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DB_FILE = "Data.json";

// Middleware
app.use(cors());
app.use(express.json());

// Helper: read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// ------------------ PRODUCTS ------------------
app.get("/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.post("/products", (req, res) => {
  const db = readDB();
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  writeDB(db);
  res.json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.products = db.products.map((p) => (p.id === id ? { ...p, ...req.body } : p));
  writeDB(db);
  res.json({ success: true });
});

app.delete("/products/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.products = db.products.filter((p) => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// ------------------ CUSTOMERS ------------------
app.get("/customers", (req, res) => {
  const db = readDB();
  res.json(db.customers);
});

app.post("/customers", (req, res) => {
  const db = readDB();
  const newCustomer = { id: Date.now(), ...req.body };
  db.customers.push(newCustomer);
  writeDB(db);
  res.json(newCustomer);
});

app.put("/customers/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.customers = db.customers.map((c) => (c.id === id ? { ...c, ...req.body } : c));
  writeDB(db);
  res.json({ success: true });
});

app.delete("/customers/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.customers = db.customers.filter((c) => c.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// ------------------ SALES ------------------
app.get("/sales", (req, res) => {
  const db = readDB();
  res.json(db.sales);
});

app.post("/sales", (req, res) => {
  const db = readDB();
  const { productId, quantity } = req.body;
  const pid = Number(productId);
  const qty = Number(quantity);
  // Find product and update quantity
  const productIndex = db.products.findIndex(p => Number(p.id) === pid);
  if (productIndex === -1) {
    return res.status(400).json({ error: "Product not found" });
  }
  if (db.products[productIndex].quantity < qty) {
    return res.status(400).json({ error: "Not enough stock" });
  }
  db.products[productIndex].quantity -= qty;
  const newSale = { id: Date.now(), ...req.body };
  db.sales.push(newSale);
  writeDB(db);
  res.json(newSale);
});


// ------------------ DASHBOARD SUMMARY ------------------
app.get("/dashboard", (req, res) => {
  const db = readDB();
  const totalProducts = db.products.length;
  const lowStock = db.products.filter(p => p.quantity <= 5).length;
  const totalSales = db.sales.reduce((sum, s) => sum + (s.total || 0), 0);
  res.json({ totalProducts, lowStock, totalSales });
});

// ------------------ INVENTORY REPORTING ------------------
app.get("/reporting", (req, res) => {
  const db = readDB();
  const lowStockThreshold = 5;
  const report = db.products.map(p => ({
    id: p.id,
    name: p.name,
    quantity: p.quantity,
    status: p.quantity <= lowStockThreshold ? "Low" : "Normal"
  }));
  res.json(report);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

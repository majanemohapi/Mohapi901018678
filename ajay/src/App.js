import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import Reporting from "./components/Reporting";
import "./App.css";

function App() {
  const [module, setModule] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);

  const API = "http://localhost:5000";

  // Load initial data
  const loadData = async () => {
    try {
      const [productsRes, customersRes, salesRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/customers`),
        fetch(`${API}/sales`),
      ]);
      setProducts(await productsRes.json());
      setCustomers(await customersRes.json());
      setSales(await salesRes.json());
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const lowStockCount = useMemo(
    () => products.filter((p) => Number(p.quantity) <= 10).length,
    [products]
  );

  const totalRevenue = useMemo(
    () => sales.reduce((sum, s) => sum + s.total, 0),
    [sales]
  );

  const recordSale = async (productId, customerId, quantity) => {
    const pid = Number(productId);
    const cid = Number(customerId);
    const qty = Number(quantity);

    const product = products.find((p) => Number(p.id) === pid);
    const customer = customers.find((c) => Number(c.id) === cid);

    if (!product) return alert("Product not found");
    if (!customer) return alert("Customer not found");
    if (Number(product.quantity) < qty) {
      return alert("Not enough stock");
    }

    const total = product.price * qty;
    const updatedQuantity = Number(product.quantity) - qty;

  
    const tempId = `temp-${Date.now()}`;
    const tempSale = {
      id: tempId,
      productId: pid,
      customerId: cid,
      quantity: qty,
      total,
      _optimistic: true,
    };

    const originalQuantity = product.quantity;

  
    setProducts((prev) =>
      prev.map((p) => (Number(p.id) === pid ? { ...p, quantity: updatedQuantity } : p))
    );
    setSales((prev) => [...prev, tempSale]);

  
    let savedSale;
    try {
      const saleRes = await fetch(`${API}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: pid, customerId: cid, quantity: qty, total }),
      });
      if (!saleRes.ok) throw new Error(`Sale POST failed: ${saleRes.status}`);
      savedSale = await saleRes.json();
    } catch (err) {
      console.error("Failed to save sale:", err);
    
      setProducts((prev) =>
        prev.map((p) => (Number(p.id) === pid ? { ...p, quantity: originalQuantity } : p))
      );
      setSales((prev) => prev.filter((s) => s.id !== tempId));
      alert("❌ Failed to record sale on server.");
      return;
    }

    
    setSales((prev) => prev.map((s) => (s.id === tempId ? savedSale : s)));

  
    try {
      const patchRes = await fetch(`${API}/products/${pid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: updatedQuantity }),
      });
      if (!patchRes.ok) {
        console.warn("Product PATCH failed:", patchRes.status);
        const prodRes = await fetch(`${API}/products/${pid}`);
        if (prodRes.ok) {
          const serverProduct = await prodRes.json();
          setProducts((prev) => prev.map((p) => (Number(p.id) === pid ? serverProduct : p)));
        }
        alert("⚠️ Sale saved but failed to update product stock.");
        return;
      }
      const patchedProduct = await patchRes.json().catch(() => null);
      if (patchedProduct) {
        setProducts((prev) => prev.map((p) => (Number(p.id) === pid ? patchedProduct : p)));
      }
    } catch (err) {
      console.error("Error updating product stock:", err);
      alert("⚠️ Sale saved but error updating product stock.");
    }
  };

  const deleteAllSales = async () => {
    try {
      const deletePromises = sales.map((s) =>
        fetch(`${API}/sales/${s.id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);
      await loadData();
      alert("Sales history cleared.");
    } catch (err) {
      console.error("Error deleting sales:", err);
      alert("Failed to clear sales history.");
    }
  };

  const Sales = ({ products, customers, sales, recordSale, deleteAllSales }) => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleSale = () => {
      if (!selectedProduct || !selectedCustomer) {
        alert("Please select both product and customer");
        return;
      }
      if (quantity < 1) {
        alert("Quantity must be at least 1");
        return;
      }

      recordSale(Number(selectedProduct), Number(selectedCustomer), Number(quantity));
      setSelectedProduct("");
      setSelectedCustomer("");
      setQuantity(1);
    };

    return (
      <div className="sales-container">
        <h3>Make A Sale</h3>
        <div className="sales-form">
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.quantity})
              </option>
            ))}
          </select>

          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button onClick={handleSale}>Sell</button>
        </div>

        <h3>Sales History</h3>
        <button onClick={deleteAllSales} style={{ marginBottom: "10px" }}>
          🗑️ Clear Sales History
        </button>
        <ul className="sales-list">
          {sales.map((s) => {
            const product = products.find((p) => Number(p.id) === Number(s.productId));
            const customer = customers.find((c) => Number(c.id) === Number(s.customerId));
            return (
              <li key={s.id}>
                {customer?.name || "Unknown Customer"} bought {product?.name || "Unknown Product"} - Qty:{" "}
                {s.quantity} - Total: ${s.total.toFixed(2)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar setModule={setModule} />
      <main className="main-content">
        {module === "dashboard" && (
          <>
            <h2 className="module-heading">DASHBOARD</h2>
            <div className="dashboard">
              <div className="dashboard-card">Total Products: {products.length}</div>
              <div className="dashboard-card">Low Stock: {lowStockCount}</div>
              <div className="dashboard-card">Total Customers: {customers.length}</div>
              <div className="dashboard-card">Total Sales: {sales.length}</div>
              <div className="dashboard-card">Revenue: ${totalRevenue.toFixed(2)}</div>
            </div>
          </>
        )}

        {module === "inventory" && <Inventory products={products} setProducts={setProducts} />}
        {module === "sales" && (
          <Sales
            products={products}
            customers={customers}
            sales={sales}
            recordSale={recordSale}
            deleteAllSales={deleteAllSales}
          />
        )}
        {module === "customers" && <Customers customers={customers} setCustomers={setCustomers} />}
        {module === "reporting" && <Reporting products={products} sales={sales} customers={customers} />}
      </main>
    </div>
  );
}

export default App;

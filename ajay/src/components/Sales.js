import React, { useState } from "react";

function Sales({ products, customers, sales, recordSale, deleteAllSales }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSale = () => {
    if (!selectedProduct || !selectedCustomer) {
      alert("Please select product and customer");
      return;
    }
    if (Number(quantity) < 1) {
      alert("Quantity must be >= 1");
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

        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <button onClick={handleSale}>Sell</button>
      </div>

      <h3>Sales History</h3>
      <button onClick={deleteAllSales}>Clear Sales</button>
      <ul className="sales-list">
        {sales.map((s) => {
          const product = products.find((p) => Number(p.id) === Number(s.productId));
          const customer = customers.find((c) => Number(c.id) === Number(s.customerId));
          return (
            <li key={s.id}>
              {customer?.name || "Unknown"} bought {product?.name || "Unknown"} — Qty: {s.quantity} — ${s.total.toFixed(2)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sales;

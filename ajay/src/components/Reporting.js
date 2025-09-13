import React from "react";
import "./Reporting.css";

function Reporting({ products, sales }) {
  // 🔹 Count how many of each product were sold
  const soldMap = {};
  sales.forEach((s) => {
    soldMap[s.productId] = (soldMap[s.productId] || 0) + s.quantity;
  });

  return (
    <div className="reporting-container">
      <h2>Inventory Report</h2>
      <table className="reporting-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Available</th>
            <th>Sold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const sold = soldMap[p.id] || 0;
            const initial = p.initialQuantity ? Number(p.initialQuantity) : Number(p.quantity) + sold;
            const remaining = Number(p.quantity);

            let status = "Normal";
            let statusClass = "normal-stock";

            // 🔹 Check sold against half of initial stock
            if (sold >= initial / 2) {
              status = "Low";
              statusClass = "low-stock";
            }

            if (remaining === 0) {
              status = "Out of Stock";
              statusClass = "out-stock";
            }

            return (
              <tr key={p.id} className={statusClass}>
                <td>{p.name}</td>
                <td>{remaining}</td>
                <td>{sold}</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Reporting;

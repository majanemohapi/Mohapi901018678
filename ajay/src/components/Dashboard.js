import React from 'react';
import './Dashboard.css';

function Dashboard({ products }) {
  const totalProducts = products.length;
  const totalSales = products.reduce((sum, p) => sum + (p.initialQuantity - p.quantity), 0);

  // 🔹 Low stock = below half of initial or completely out
  const lowStockCount = products.filter(p => {
    const quantity = Number(p.quantity);
    const initial = Number(p.initialQuantity);

    return quantity === 0 || quantity < initial / 2;
  }).length;

  return (
    <div className="dashboard">
      <div className="dashboard-card">Total Products: {totalProducts}</div>
      <div className="dashboard-card">Low Stock: {lowStockCount}</div>
      <div className="dashboard-card">Total Sales: {totalSales}</div>
    </div>
  );
}

export default Dashboard;

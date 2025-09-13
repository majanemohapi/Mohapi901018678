import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ setModule }) {
  const [showContact, setShowContact] = useState(false);

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">WINGS CAFE SYSTEM</h1>

      <nav className="sidebar-nav">
        <button onClick={() => setModule('dashboard')}>Dashboard</button>
        <button onClick={() => setModule('inventory')}>Inventory</button>
        <button onClick={() => setModule('sales')}>Sales</button>
        <button onClick={() => setModule('customers')}>Customers</button>
        <button onClick={() => setModule('reporting')}>Reporting</button>
      </nav>

      <div
        className="contact-us"
        onMouseEnter={() => setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
      >
        <p className="contact-title">Contact Us</p>

        {showContact && (
          <div className="contact-details">
            <h3>WINGS CAFE</h3>
            <p>We serve Coffee, Cookies, and Pastries.</p>
            <p>
              Phone: <a href="tel:+266 6277 4885">+266 6277 4885</a><br />
              Email: <a href="mailto:info@wingscafe.com">info@wingscafe.com</a>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

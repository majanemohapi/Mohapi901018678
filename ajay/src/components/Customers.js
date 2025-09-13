import React, { useState } from 'react';
import './Customers.css';

function Customers({ customers, setCustomers }) {
  const [form, setForm] = useState({ id: null, name: '', email: '' });
  const [showForm, setShowForm] = useState(false);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitCustomer = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert('Name and email are required');

    const customer = { id: form.id || Date.now(), name: form.name, email: form.email };

    if (form.id) {
      
      setCustomers(customers.map(c => c.id === form.id ? customer : c));
    } else {
      setCustomers([...customers, customer]);
    }

    setForm({ id: null, name: '', email: '' });
    setShowForm(false);
  };

  const editCustomer = (c) => {
    setForm(c);
    setShowForm(true);
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="customers-container">
      <button onClick={() => setShowForm(!showForm)} className="btn-toggle-form">
        {showForm ? 'Cancel' : 'Add Customer'}
      </button>

      {showForm && (
        <form onSubmit={submitCustomer} className="customers-form">
          <input
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="Customer Name"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleInput}
            placeholder="Customer Email"
            required
          />
          <button type="submit">Save Customer</button>
        </form>
      )}

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td className="actions">
                <button onClick={() => editCustomer(c)} className="btn-edit">Edit</button>
                <button onClick={() => deleteCustomer(c.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;

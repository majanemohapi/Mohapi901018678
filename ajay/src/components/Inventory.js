import React, { useState } from 'react';
import './Inventory.css';

function Inventory({ products, setProducts }) {
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitProduct = () => {
    const { name, description, category, price, quantity } = form;
    if (!name || !description || !category || !price || !quantity)
      return alert('All fields are required');

    const newProduct = {
      id: form.id || Date.now(),
      name,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    };

    if (form.id) {
      // Update existing product
      setProducts(products.map(p => (p.id === form.id ? newProduct : p)));
    } else {
      // Add new product
      setProducts([...products, newProduct]);
    }

    setForm({ id: null, name: '', description: '', category: '', price: '', quantity: '' });
  };

  const editProduct = (p) => setForm(p);
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <div className="inventory-container">
      <h3>{form.id ? 'Edit Product' : 'Add New Product'}</h3>
      <div className="inventory-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleInput}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInput}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleInput}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInput}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleInput}
        />
        <button onClick={submitProduct}>
          {form.id ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <h3>Product List</h3>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;

"use client";
import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from backend
  async function fetchAll() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <div className="container">Loading Visibility System...</div>;

  // 2. Logic to calculate summary cards (Guaranteed no NaN)
  const totalItems = items.length;
  const deadCount = items.filter(i => i.quantity === 0).length;
  const lowCount = items.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold).length;
  const healthyCount = items.filter(i => i.quantity > i.minThreshold).length;

  return (
    <div className="container">
      <header>
        <h1>Inventory Visibility Dashboard</h1>
        <p>AEC Material Management System</p>
      </header>

      {/* SUMMARY CARDS */}
      <div className="stats">
        <StatCard title="Total SKUs" value={totalItems} />
        <StatCard title="Low Stock" value={lowCount} color="#ef6c00" />
        <StatCard title="Dead Inventory" value={deadCount} color="#c62828" />
        <StatCard title="Healthy Items" value={healthyCount} color="#2e7d32" />
      </div>

      <div className="form-section">
        <h3>Register New Material</h3>
        <AddInventoryForm onAdd={fetchAll} />
      </div>

      <InventoryTable items={items} onUpdate={fetchAll} />
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, value, color }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2 style={{ color: color || "#333" }}>{value}</h2>
    </div>
  );
}

function AddInventoryForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", sku: "", quantity: "", minThreshold: "" });
  const [error, setError] = useState(""); // New: Error state

  async function submit(e) {
    e.preventDefault();
    setError(""); // Reset error on new attempt

    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          quantity: Number(form.quantity), 
          minThreshold: Number(form.minThreshold) 
        })
      });

      if (!res.ok) {
        const data = await res.json();
        // Check if backend sent a specific uniqueness error
        if (res.status === 400 || res.status === 409 || data.error?.includes("unique")) {
          throw new Error(`SKU "${form.sku}" already exists. Please use a unique code.`);
        }
        throw new Error("Failed to add inventory.");
      }

      setForm({ name: "", sku: "", quantity: "", minThreshold: "" });
      onAdd();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-section">
      <h3>Register New Material</h3>
      
      {/* Error Alert Box */}
      {error && (
        <div style={{ color: "#721c24", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #f5c6cb" }}>
          ⚠️ {error}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <input placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="SKU Code" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
        <input type="number" placeholder="Min Threshold" value={form.minThreshold} onChange={e => setForm({...form, minThreshold: e.target.value})} required />
        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
}

function InventoryTable({ items, onUpdate }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Material Name</th>
          <th>SKU</th>
          <th>Stock Level</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <InventoryRow key={item.id} item={item} onUpdate={onUpdate} />
        ))}
      </tbody>
    </table>
  );
}

function InventoryRow({ item, onUpdate }) {
  const [newQty, setNewQty] = useState(item.quantity);
  const [updating, setUpdating] = useState(false); // New: Loading state for button

  async function handleUpdate() {
    if (newQty < 0) return alert("Quantity cannot be negative");
    
    try {
      setUpdating(true);
      await fetch(`${API_BASE}/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(newQty) })
      });
      onUpdate();
    } catch (err) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  }

  // Derived Logic: Status updates instantly when typing in the input
  let statusText = "HEALTHY";
  let statusClass = "OK";

  const currentQty = Number(newQty);
  if (currentQty === 0) {
    statusText = "DEAD STOCK";
    statusClass = "DEAD";
  } else if (currentQty <= item.minThreshold) {
    statusText = "LOW STOCK";
    statusClass = "Low";
  }

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.sku}</td>
      <td>
        <input 
          type="number" 
          value={newQty} 
          onChange={e => setNewQty(e.target.value)} 
          style={{ width: '70px', padding: '5px' }} 
        />
      </td>
      <td>
        <span className={`badge ${statusClass}`}>
          {statusText}
        </span>
      </td>
      <td>
        <button onClick={handleUpdate} disabled={updating}>
          {updating ? "..." : "Update"}
        </button>
      </td>
    </tr>
  );
}
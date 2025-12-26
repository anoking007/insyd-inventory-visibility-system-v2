"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/inventory")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

# Inventory Visibility System

A professional full-stack **Inventory Visibility System** built for the Insyd SDE Intern assignment. This system helps Indian material businesses in the AEC (Architecture, Engineering, and Construction) sector gain real-time visibility over their stock levels to reduce dead inventory and improve net margins.

---

## 📌 Problem Statement

Most Indian material businesses lack visibility over their inventory levels, leading to low net margins due to dead inventory, poor-performing SKUs, and damaged stock. This project provides a centralized digital dashboard to restore confidence in their ability to scale operations.

---

## 🧠 Solution Overview

The system provides a "Source of Truth" for material stock by allowing users to:
- **Add New Materials:** Register items with unique SKUs and set minimum thresholds.
- **Real-Time Visibility:** Categorize items into **Healthy**, **Low Stock**, and **Dead Inventory** cards for instant analysis.
- **Dynamic Updates:** Update stock quantities directly from the UI with immediate status badge changes.
- **Error Handling:** Prevention of duplicate SKUs and negative quantities to ensure data integrity.

---

## 🏗️ System Architecture

The application follows a decoupled three-tier architecture:

**Frontend (Next.js)** → **Backend API (Express.js)** → **Database (Neon PostgreSQL)**

1. **Frontend:** Handles user interaction and derives inventory status dynamically.
2. **Backend:** Manages business logic and SKU validation using a RESTful API.
3. **Database:** High-performance cloud storage ensuring data is persistent and "restart-safe".

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (JavaScript)
- **React Hooks** (State & Effect management)
- Deployed on **Vercel**

### Backend
- **Node.js & Express.js**
- **Prisma ORM v7** (Type-safe database access)
- Deployed on **Render**

### Database
- **PostgreSQL (Neon)** (Cloud-native relational database)

---

## 🌐 Live Application

- **Frontend (Live Dashboard):** [https://insyd-inventory-visibility-system-v.vercel.app](https://insyd-inventory-visibility-system-v.vercel.app)

- **Backend (API Base URL):** [https://insyd-inventory-visibility-system-v2.onrender.com](https://insyd-inventory-visibility-system-v2.onrender.com)

---

## 🔗 Backend API Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/inventory` | Fetch all inventory items |
| POST | `/inventory` | Create a new inventory record |
| PUT | `/inventory/:id` | Update stock quantity by ID |
| GET | `/inventory/low-stock` | Retrieve materials below threshold |
| GET | `/inventory/dead-stock` | Retrieve items with zero quantity |

---

## 📊 Inventory Status Logic

To maintain data consistency, status is **derived dynamically** from current quantity and threshold values:
- **Dead Inventory:** `quantity === 0`
- **Low Stock:** `quantity <= minThreshold`
- **Healthy:** `quantity > minThreshold`

---

## 🧪 Testing Scenarios

Verified the following features for end-to-end correctness:
- ✅ Successive additions of materials with unique SKUs.
- ✅ Graceful error handling and alerts for duplicate SKU entries.
- ✅ Real-time status badge updates (e.g., Healthy → Low Stock) when modifying quantities.
- ✅ Persistence of data across server restarts and browser refreshes.

---

## 🔐 Security & Best Practices

- **Environment Variables:** All database credentials and API keys are managed through `.env` files (not committed to Git).
- **CORS Configuration:** Restricts API access to authorized origins.
- **Input Validation:** Backend ensures that quantity and threshold inputs are valid integers.

---

## 👤 Author

**Arghya Ghosh** 

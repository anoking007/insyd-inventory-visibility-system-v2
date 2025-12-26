# Backend — Inventory Visibility System

1. Install Node.js (v14+).
2. In project root run:
   - npm install
   - Copy .env.example -> .env (if you want custom PORT)
   - npm run dev  (for development with nodemon) or npm start

Common issues:
- Missing route modules: the server will log which route file failed to load. Create the corresponding file under ./routes or fix the require path.
- Port already in use: change PORT in .env or stop other process.
- Module not found: run npm install.

## Inventory Visibility System

A simple inventory management system built to help material businesses
gain real-time visibility into their stock.

### Tech Stack
- Next.js
- Express.js

### Features
- Inventory tracking
- Low stock alerts
- Dead stock identification

### How to Run
1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`

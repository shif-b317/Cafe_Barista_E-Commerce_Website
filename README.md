# ☕ Café Barista - Premium Cozy Bakery & Café E-Commerce Web Application

Welcome to **Café Barista**, a modern, elegant, and cozy full-stack Bakery & Café E-Commerce Web Application. The design is inspired by premium artisanal dessert brands and warm cozy cafés, boasting organic layouts, rounded cards, subtle shadows, smooth animations, and curated typography.

## 🔗 Live Deployments
* **Live Website (Frontend):** [https://cafe-barista-e-commerce-website.vercel.app/](https://cafe-barista-e-commerce-website.vercel.app/)
* **API Server (Backend):** [https://cafe-barista-e-commerce-website.onrender.com/](https://cafe-barista-e-commerce-website.onrender.com/)

---

## 🎨 Color Palette & Vibe
The design strictly utilizes a warm, organic color palette:
* **Oat Milk** (`#F7F1E6`): Main background
* **Peony Blush** (`#E8C5C0`): Secondary sections & cards
* **Canyon Clay** (`#C26D53`): Buttons, active elements & highlights
* **Eucalyptus Mist** (`#A3AE9A`): Accent backgrounds
* **Coastal Haze** (`#8FA1B2`): Hover effects & UI accents
* **Forest Floor** (`#4E5A46`): Primary text, navbars & footers

---

## 🚀 Tech Stack

### Frontend (Client)
* **Framework:** React.js (built with Vite)
* **Styling:** Vanilla CSS & Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API (Separate context for Auth and Cart)
* **HTTP Client:** Axios (linked to production/development backends dynamically)

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs (password hashing)
* **Environment Configuration:** dotenv

---

## 🌟 Key Features

* **Artisanal Menu Catalog:** Filter and search through categories like Cakes, Pastries, Cupcakes, Donuts, Cookies, Sandwiches, Fries, Hot/Cold Beverages, Desserts, and global bakery items.
* **Shopping Cart:** Add, remove, and update quantities with real-time price totals. Cart state is persisted locally.
* **Checkout Flow:** Interactive address input, contact validation (Indian prefix numbers), price conversion in Indian Rupees (₹), and payment gateway mock.
* **Order Tracking:** Follow order status stages in real-time (*Pending ➜ Preparing ➜ Out for Delivery ➜ Delivered*).
* **User Profile & History:** View past orders, total spending, and update user credentials.
* **Admin Dashboard:** Access for admins to manage product catalog (Create, Update, Delete items) and modify order statuses.

---

## 📂 Project Structure

```text
Cafe Barista/
├── client/                 # React & Vite frontend code
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar, Footer, ProductCard)
│   │   ├── context/        # Context providers (AuthContext, CartContext)
│   │   ├── pages/          # Core pages (Home, Shop, Cart, Checkout, OrderTracking, Admin)
│   │   ├── utils/          # Axios instance and API helper configurations
│   │   └── index.css       # Global design tokens and root styles
│   └── package.json
│
├── server/                 # Express backend code
│   ├── config/             # DB connection configuration
│   ├── controllers/        # Express route handlers
│   ├── middleware/         # JWT authorization & role validation middleware
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # Route configurations
│   ├── utils/              # Database seeding scripts (seed.js)
│   └── package.json
│
└── package.json            # Root configuration and run scripts
```

---

## 💻 Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas URI.

### Steps to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shif-b317/Cafe_Barista_E-Commerce_Website.git
   cd "Cafe Barista"
   ```

2. **Install all dependencies** (installs root, client, and server dependencies simultaneously):
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables:**
   * Inside the `server/` directory, create a `.env` file:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://127.0.0.1:27017/cafe-barista
     JWT_SECRET=cafebarista_secret_key_change_in_production
     NODE_ENV=development
     ```

4. **Seed the database** (populates your database with 131 initial cozy menu items and admin/customer accounts):
   ```bash
   npm run seed
   ```

5. **Start the Development Servers** (runs both frontend and backend concurrently):
   ```bash
   npm run dev
   ```
   * Frontend will launch at: `http://localhost:5173`
   * Backend API will run at: `http://localhost:5000`

---

## 👤 Test Credentials
You can log in with these pre-seeded accounts:

* **Admin Account:**
  * **Email:** `admin@cafebarista.com`
  * **Password:** `admin123`
* **Customer Account:**
  * **Email:** `customer@gmail.com`
  * **Password:** `customer123`

#  Café Barista - E-Commerce Web Application

Welcome to **Café Barista**, a modern, elegant, and cozy full-stack Bakery & Café E-Commerce Web Application. The design is inspired by premium artisanal dessert brands and warm cozy cafés, boasting organic layouts, rounded cards, subtle shadows, smooth animations, and curated typography.

##  Live Deployments
* **Live Website (Frontend):** [https://cafe-barista-e-commerce-website.vercel.app/](https://cafe-barista-e-commerce-website.vercel.app/)
* **API Server (Backend):** [https://cafe-barista-e-commerce-website.onrender.com/](https://cafe-barista-e-commerce-website.onrender.com/)

---

##  Color Palette & Vibe
The design strictly utilizes a warm, organic color palette:
* **Oat Milk** (`#F7F1E6`): Main background
* **Peony Blush** (`#E8C5C0`): Secondary sections & cards
* **Canyon Clay** (`#C26D53`): Buttons, active elements & highlights
* **Eucalyptus Mist** (`#A3AE9A`): Accent backgrounds
* **Coastal Haze** (`#8FA1B2`): Hover effects & UI accents
* **Forest Floor** (`#4E5A46`): Primary text, navbars & footers

---

##  Tech Stack

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

##  Key Features

* **Artisanal Menu Catalog:** Filter and search through categories like Cakes, Pastries, Cupcakes, Donuts, Cookies, Sandwiches, Fries, Hot/Cold Beverages, Desserts, and global bakery items.
* **Shopping Cart:** Add, remove, and update quantities with real-time price totals. Cart state is persisted locally.
* **Checkout Flow:** Interactive address input, contact validation (Indian prefix numbers), price conversion in Indian Rupees (₹), and payment gateway mock.
* **Order Tracking:** Follow order status stages in real-time (*Pending ➜ Preparing ➜ Out for Delivery ➜ Delivered*).
* **User Profile & History:** View past orders, total spending, and update user credentials.
* **Admin Dashboard:** Access for admins to manage product catalog (Create, Update, Delete items) and modify order statuses.



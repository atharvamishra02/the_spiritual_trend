# Spiritual Trend Project Setup & API Guide

## 🚀 Project Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd The-Spiritual-Trend
```

### 2. Install Dependencies
#### Backend
```bash
cd Backend
npm install
```
#### Main Frontend
```bash
cd ../frontend
npm install
```
#### Admin Panel
```bash
cd ../admin/frontend
npm install
```

### 3. Environment Variables
#### Backend `.env` example:
```
MONGO_URI=mongodb://localhost:27017/spiritual-trend
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=30d
PORT=5000
```

### 4. Start the Servers
#### Backend
```bash
cd Backend
npm run dev
```
#### Main Frontend
```bash
cd ../frontend
npm run dev
```
#### Admin Panel
```bash
cd ../admin/frontend
npm run dev
```

---

## 🛡️ System Overview
- **Admin Panel**: Manage products, categories, homepage sections, and orders.
- **Main Frontend**: User-facing shop, wishlist, cart, and category browsing.
- **Backend**: REST API for authentication, product management, categories, orders, and homepage content.

---

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `GET /api/auth/me` — Get current user profile (token required)
- `POST /api/admin/login` — Admin login
- `POST /api/admin/refresh` — Refresh admin JWT token

### **Products**
- `GET /api/products/public` — Get all active products
- `GET /api/products/public/:id` — Get product by ID
- `GET /api/products/public/category/:category` — Get products by category name
- `POST /api/admin/products` — Create product (admin)
- `PUT /api/admin/products/:id` — Update product (admin)
- `DELETE /api/admin/products/:id` — Delete product (admin)
- `POST /api/products/upload-image` — Upload product/category image

### **Categories**
- `GET /api/homepage/categories` — Get all homepage categories (for Shop by Category)
- `POST /api/homepage/categories` — Create a new category (admin)
- `PUT /api/homepage/categories/:id` — Update a category (admin)
- `DELETE /api/homepage/categories/:id` — Delete a category (admin)

### **Homepage Sections**
- `GET /api/products/homepage/featured` — Get featured products
- `GET /api/products/homepage/famous` — Get famous/favourite products
- `POST /api/admin/products/homepage/update` — Batch update homepage sections (admin)

### **Wishlist**
- Managed client-side for guests, or via user profile for logged-in users

### **Cart**
- Managed client-side for guests, or via user profile for logged-in users

### **Orders**
- `GET /api/admin/orders` — Get all orders (admin)
- `PUT /api/admin/orders/:id` — Update order status (admin)
- `GET /api/orders/me` — Get current user's orders
- `POST /api/orders` — Place a new order

---

## 🛍️ How It Works

- **Admin Panel**: Add/edit/delete products and categories, manage homepage sections, upload images, and process orders. All changes are saved to the backend and reflected on the main site.
- **Main Frontend**: Users can browse products, add to wishlist/cart, view categories, and place orders. The homepage and category pages are fully dynamic.
- **Categories**: Managed in the admin panel. Each category has a name and image. Categories appear in the "Shop by Category" section. Clicking a category navigates to a dedicated page showing all products in that category.
- **Homepage Sections**: Admin can feature products or mark them as famous/favourite. These appear in special homepage sections.
- **Image Uploads**: All images (products, categories) are uploaded via `/api/products/upload-image` and stored in the backend's `/uploads` folder.
- **Authentication**: JWT-based for both users and admins. Admin routes require a valid admin token.

---

## 🔗 Useful URLs
- **Main Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:5000

---

## 📝 Notes
- Make sure to restart the backend after any changes to routes or models.
- For image uploads, ensure the `/uploads` folder exists and is writable.
- All admin-protected routes require a valid admin JWT token in the `Authorization` header.
- For category navigation, slugs are auto-generated from the category name (e.g., "Pendants" → `pendants`).

---

For any issues, check the backend logs and ensure all servers are running on the correct ports. 
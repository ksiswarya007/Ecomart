# 🛒 EcoMart : E-Commerce Platform

**EcoMart** is a modern e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with online payment integration via Stripe, image hosting with Cloudinary, and deployment via Vercel and MongoDB Atlas.

🔗 **Live Site:** [https://ecomart-final.vercel.app](https://ecomart-final.vercel.app)

---

## 📦 Features

- 🛍️ Product browsing and filtering
- 🧾 Cart & Checkout
- 💳 Payments via Stripe (COD and Online)
- 👤 User authentication
- 📦 Order tracking (user & admin views)
- ☁️ Image uploading with Cloudinary
- ⚙️ Admin dashboard (for seller/admin users)

---

## 🛠️ Technologies Used

### Frontend (Client)
- React 19
- Vite 6
- Tailwind CSS
- React Router v7
- Axios
- React Hot Toast

### Backend (Server)
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Stripe for payments
- Cloudinary for image upload
- JWT for authentication

---
## Create a .env file inside the server directory with the following:
```
PORT=4000
JWT_SECRET=your_jwt_secret_key

# MongoDB Atlas
MONGODB_URI=your_mongodb_connection_string

# Admin credentials
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=adminpassword

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=your_stripe_pk
STRIPE_SECRET_KEY=your_stripe_sk
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```
---
🔐 Admin/Seller Dashboard
  Access the Admin (Seller) Dashboard here:
  
🔗 https://ecomart-final.vercel.app/seller

 **Note:** Admin login credentials are available upon request for demo/testing purposes.

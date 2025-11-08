# 🛒 Bardahl Ukraine Store

E-commerce API for Bardahl Ukraine automotive products built with Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **RESTful API** with Express.js
- **PostgreSQL Database** with Prisma ORM  
- **Product & Category Management**
- **Pagination & Search**
- **Caching System** for performance
- **Professional Architecture** with services and repositories
- **Landing Page** with redirect to main store

## 📦 API Endpoints

### Products
- `GET /api/products` - List products with pagination
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products

### Categories  
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug/products` - Products by category

### System
- `GET /api/health` - Health check
- `GET /api/info` - API information

## 🏗️ Project Structure
bardahl_ukr/
├── src/
│ ├── controllers/ # Request handlers
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ ├── repositories/ # Data access layer
│ ├── utils/ # Utilities
│ ├── app.js # Express app configuration
│ └── server.js # Server entry point
├── prisma/ # Database schema & migrations
├── public/ # Static files & landing page
└── package.json                                                                
## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Prisma ORM
- **Architecture**: MVC with Services & Repositories
- **Caching**: Node-cache
- **Environment**: Dotenv

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bardahl-ukraine-store.git
   cd bardahl-ukraine-store                                                     2   Install dependencies                                                            npm install                                                                  3 Setup database                                                                  npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed                                                              4 Start development server                                                          npm run dev                                                                 Access the application

API: http://localhost:3000/api/health

Landing: http://localhost:3000/                                                     📊 Database Schema
The project uses PostgreSQL with the following main tables:

products - Product catalog

categories - Product categories

users - User accounts

carts - Shopping carts

orders - Customer orders

🔗 Links
Main Store: https://bardahl-chop.com.ua

API Documentation: Available at /api/info endpoint

📄 License
MIT License - see LICENSE file for details

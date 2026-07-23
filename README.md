# E-commerce API

## Project Title and Description

This project is a simple e-commerce backend API built with Node.js, Express.js, MongoDB, and Mongoose. It provides a clean RESTful structure for managing categories, products, shopping cart items, and customer orders. The API is designed to be easy to test with Postman and to support basic product filtering for frontend or mobile app integration.

### Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

This API includes the following major modules:

- Categories API
  - Create, read, update, and delete product categories.
- Products API
  - Create, read, update, and delete products.
  - Supports query filtering by fields such as `inStock`, `price`, `name`, and `description`.
- Cart API
  - Add products to a shopping cart.
  - Update item quantity.
  - Remove a single cart item or clear the full cart.
- Orders API
  - Create an order from the current cart.
  - Fetch all orders for the default user.
  - Update order status.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js 18+ or later
- MongoDB running locally or an Atlas cluster
- npm (recommended) or yarn
- A terminal such as PowerShell, CMD, or Git Bash

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd my-mongo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the required environment variables.

4. Seed the database with sample products and categories:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. For production-style startup, you can run:

   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root folder with the following variables:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | The port number where the Express server will run. Example: `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. Use a local MongoDB URI such as `mongodb://localhost:27017/testdb` or an Atlas connection string. |

Example `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/testdb
```

## How the Project Works

The application starts in `server.js`, which:

1. loads environment variables using `dotenv`
2. connects to MongoDB using `connectDB()` from `config/db.js`
3. creates the Express app
4. parses JSON request bodies with `express.json()`
5. mounts the route handlers for each API section:
   - `/api/products`
   - `/api/categories`
   - `/api/cart`
   - `/api/orders`

Each section is separated into:

- `routes/` — defines the endpoint paths
- `controllers/` — contains request handling logic
- `models/` — defines the database schema for MongoDB collections
- `middleware/` — contains reusable error handling and async wrappers

The API uses Mongoose models to save and retrieve data from MongoDB collections such as `Category`, `Product`, `Cart`, and `Order`.

## API Endpoints

### Categories

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/categories` | Get all categories. |
| `POST` | `/api/categories` | Create a new category. |
| `PUT` | `/api/categories/:id` | Update an existing category by ID. |
| `DELETE` | `/api/categories/:id` | Delete a category by ID. |

### Products

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get all products with optional query filtering. |
| `POST` | `/api/products` | Create a product. |
| `GET` | `/api/products/:id` | Get a single product by ID. |
| `PUT` | `/api/products/:id` | Update a product by ID. |
| `DELETE` | `/api/products/:id` | Delete a product by ID. |

#### Product Filtering Examples

The `GET /api/products` endpoint supports query parameters for filtering and pagination, including:

- `?inStock=true`
- `?price[gte]=500`
- `?price[lte]=1000`
- `?name=iphone`
- `?description=laptop`
- `?sort=price`
- `?limit=2&page=1`

These query parameters are parsed in the product controller and converted into MongoDB filter conditions.

### Cart

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/cart` | Get the current cart for the default user. |
| `POST` | `/api/cart` | Add a product to the cart. |
| `PUT` | `/api/cart/:itemId` | Update the quantity of a cart item. |
| `DELETE` | `/api/cart/:itemId` | Remove an item from the cart. |
| `DELETE` | `/api/cart` | Clear the entire cart. |

### Orders

| Method | URL | Description |
| --- | --- | --- |
| `POST` | `/api/orders` | Create an order from the current cart. This checks stock and reduces stock after order creation. |
| `GET` | `/api/orders` | Get all orders for the default user. |
| `PUT` | `/api/orders/:id/status` | Update the status of an existing order. |

## Project Structure

The project folder is organized as follows:

```text
my-mongo/
├── .env                   # Environment variables for MongoDB and port configuration
├── package.json           # Project scripts and dependencies
├── server.js              # Server entry point and route mounting
├── config/
│   └── db.js              # MongoDB connection logic
├── controllers/
│   ├── ProductController.js
│   ├── categoryController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── asyncHandler.js    # Async error wrapper for controllers
│   └── errorMiddleware.js # Central error handling middleware
├── models/
│   ├── Product.models.js  # Product schema
│   ├── Category.models.js # Category schema
│   ├── Cart.js            # Cart schema
│   └── order.js           # Order schema
├── routes/
│   ├── productRoutes.js   # Product routes
│   ├── categoryRoutes.js  # Category routes
│   ├── cartRoutes.js      # Cart routes
│   └── orderRoutes.js     # Order routes
├── utils/
│   └── data-seed.js       # Seeds categories and products into MongoDB
└── postman/
    └── E-commerce API project.postman_collection.json
```

### Folder Explanations

- `config/` contains database connection setup.
- `controllers/` contains the business logic for every API section.
- `middleware/` contains reusable logic for async error handling and request error responses.
- `models/` defines the Mongoose schemas used by MongoDB.
- `routes/` maps HTTP endpoints to controller functions.
- `utils/` is used for database seeding and sample data initialization.
- `postman/` contains a Postman collection for easy endpoint testing.

## Data Flow Overview

A typical request in this project follows this path:

1. The client sends an HTTP request to an endpoint such as `/api/products`.
2. The matching router file in `routes/` receives the request.
3. The router passes the request to the correct controller function.
4. The controller performs database operations using the related Mongoose model.
5. The API returns a JSON response with `success`, `count`, and `data` fields where applicable.

## Notes

- The project uses a single default user for cart and order operations (`userId: 'default_user'`).
- The cart is stored in MongoDB and populated with product data.
- The order flow checks stock availability before placing the order and reduces inventory after a successful order is created.
- The `GET /api/products` route is the main place to use filtering and pagination in Postman.

## Useful Commands

```bash
npm install
npm run seed
npm run dev
npm start
```

## Summary

This repository is a practical Node.js + Express + MongoDB backend for a small e-commerce system. It demonstrates how to structure an API using controllers, routes, middleware, and Mongoose models, while also providing a straightforward testing workflow through Postman.

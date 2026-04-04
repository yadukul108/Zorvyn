# Finance Dashboard API

A Node.js/Express API for managing personal finance transactions with analytics features and role-based access control.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC) with three roles:
  - **Viewer**: Can view their own transactions and analytics
  - **Analyst**: Can view all transactions and analytics, manage their own transactions
  - **Admin**: Full access to all features including user and role management

### Transaction Management
- Create, read, update, delete transactions
- Support for income and expense transactions
- Categories, subcategories, tags, and payment methods
- Recurring transactions support

### Analytics & Dashboard

#### 1. Dashboard Summary API
Get a summary of income, expenses, and balance for a user.

**Endpoint:** `GET /api/transactions/analytics/dashboard`

**Query Parameters:**
- `dateFrom` (optional): Start date in ISO format
- `dateTo` (optional): End date in ISO format

**Response:**
```json
{
  "income": 5000.00,
  "expense": 3200.00,
  "balance": 1800.00,
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z"
  }
}
```

#### 2. Category-wise Aggregation
Get transaction totals grouped by category.

**Endpoint:** `GET /api/transactions/analytics/categories`

**Query Parameters:**
- `dateFrom` (optional): Start date in ISO format
- `dateTo` (optional): End date in ISO format

**Response:**
```json
{
  "categories": [
    {
      "category": "Food",
      "income": 0,
      "expense": 1200.00,
      "transactionCount": 15,
      "netAmount": -1200.00
    },
    {
      "category": "Salary",
      "income": 5000.00,
      "expense": 0,
      "transactionCount": 1,
      "netAmount": 5000.00
    }
  ],
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z"
  }
}
```

#### 3. Monthly Trends Analytics
Get monthly transaction trends for a specific year.

**Endpoint:** `GET /api/transactions/analytics/trends/:year`

**Parameters:**
- `year` (optional): Year (defaults to current year)

**Response:**
```json
{
  "year": 2024,
  "monthlyTrends": [
    {
      "year": 2024,
      "month": 1,
      "income": 5000.00,
      "expense": 3200.00,
      "transactionCount": 12,
      "balance": 1800.00
    },
    {
      "year": 2024,
      "month": 2,
      "income": 5000.00,
      "expense": 2800.00,
      "transactionCount": 10,
      "balance": 2200.00
    }
    // ... months with zero values for months with no transactions
  ]
}
```

## Role-Based Access Control (RBAC)

### Roles and Permissions

#### Viewer
- ✅ View own transactions
- ✅ Access analytics (dashboard, categories, trends)
- ❌ Create/update/delete transactions
- ❌ View other users' data
- ❌ User/role management

#### Analyst
- ✅ View all transactions and analytics
- ✅ Create/update/delete own transactions
- ✅ View all users (read-only)
- ❌ Update other users' transactions
- ❌ User/role management

#### Admin
- ✅ Full access to all transactions
- ✅ Full user management (create, update, delete, assign roles, change status)
- ✅ Full role management (create, view roles)

### Permission Matrix

| Feature | Viewer | Analyst | Admin |
|---------|--------|---------|-------|
| View own transactions | ✅ | ✅ | ✅ |
| View all transactions | ❌ | ✅ | ✅ |
| Create transactions | ❌ | ✅ | ✅ |
| Update own transactions | ❌ | ✅ | ✅ |
| Update all transactions | ❌ | ❌ | ✅ |
| Delete own transactions | ❌ | ✅ | ✅ |
| Delete all transactions | ❌ | ❌ | ✅ |
| Access analytics | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ✅ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Update all users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Assign user roles | ❌ | ❌ | ✅ |
| Update user status | ❌ | ❌ | ✅ |
| View roles | ❌ | ✅ | ✅ |
| Create roles | ❌ | ❌ | ✅ |

## API Endpoints

### Authentication Required
All endpoints require authentication via JWT token in Authorization header.

### Transaction CRUD
- `GET /api/transactions` - List transactions with pagination and filters
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/transactions/analytics/dashboard` - Dashboard summary
- `GET /api/transactions/analytics/categories` - Category aggregation
- `GET /api/transactions/analytics/trends/:year` - Monthly trends

### User Management (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/role` - Assign role to user
- `PATCH /api/users/:id/status` - Update user status

### Role Management (Admin only)
- `GET /api/roles` - List all roles
- `POST /api/roles` - Create new role

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Database Schema

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: ObjectId (reference to Role, required)
- `status`: String (enum: 'active', 'inactive', 'suspended')
- `lastLogin`: Date
- `profile`: Object (avatar, phone, department)

### Role
- `name`: String (required, unique, enum: 'Viewer', 'Analyst', 'Admin')
- `description`: String
- `permissions`: Array of Strings
- `isActive`: Boolean

### Transaction
- `user`: ObjectId (reference to User)
- `amount`: Number (required)
- `type`: String (enum: 'income', 'expense')
- `category`: String (required)
- `subcategory`: String
- `date`: Date (required)
- `description`: String
- `notes`: String
- `tags`: Array of Strings
- `paymentMethod`: String (enum)
- `isRecurring`: Boolean
- `recurringFrequency`: String
- `status`: String (enum: 'pending', 'completed', 'cancelled')
- `attachments`: Array of Objects

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Zod for validation
- Role-based access control middleware

## Features

### Transaction Management
- Create, read, update, delete transactions
- Support for income and expense transactions
- Categories, subcategories, tags, and payment methods
- Recurring transactions support

### Analytics & Dashboard

#### 1. Dashboard Summary API
Get a summary of income, expenses, and balance for a user.

**Endpoint:** `GET /api/transactions/analytics/dashboard`

**Query Parameters:**
- `dateFrom` (optional): Start date in ISO format
- `dateTo` (optional): End date in ISO format

**Response:**
```json
{
  "income": 5000.00,
  "expense": 3200.00,
  "balance": 1800.00,
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z"
  }
}
```

#### 2. Category-wise Aggregation
Get transaction totals grouped by category.

**Endpoint:** `GET /api/transactions/analytics/categories`

**Query Parameters:**
- `dateFrom` (optional): Start date in ISO format
- `dateTo` (optional): End date in ISO format

**Response:**
```json
{
  "categories": [
    {
      "category": "Food",
      "income": 0,
      "expense": 1200.00,
      "transactionCount": 15,
      "netAmount": -1200.00
    },
    {
      "category": "Salary",
      "income": 5000.00,
      "expense": 0,
      "transactionCount": 1,
      "netAmount": 5000.00
    }
  ],
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z"
  }
}
```

#### 3. Monthly Trends Analytics
Get monthly transaction trends for a specific year.

**Endpoint:** `GET /api/transactions/analytics/trends/:year`

**Parameters:**
- `year` (optional): Year (defaults to current year)

**Response:**
```json
{
  "year": 2024,
  "monthlyTrends": [
    {
      "year": 2024,
      "month": 1,
      "income": 5000.00,
      "expense": 3200.00,
      "transactionCount": 12,
      "balance": 1800.00
    },
    {
      "year": 2024,
      "month": 2,
      "income": 5000.00,
      "expense": 2800.00,
      "transactionCount": 10,
      "balance": 2200.00
    }
    // ... months with zero values for months with no transactions
  ]
}
```

## API Endpoints

### Authentication Required
All endpoints require authentication via JWT token in Authorization header.

### Transaction CRUD
- `GET /api/transactions` - List transactions with pagination and filters
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/transactions/analytics/dashboard` - Dashboard summary
- `GET /api/transactions/analytics/categories` - Category aggregation
- `GET /api/transactions/analytics/trends/:year` - Monthly trends

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Database Schema

### Transaction
- `user`: ObjectId (reference to User)
- `amount`: Number (required)
- `type`: String (enum: 'income', 'expense')
- `category`: String (required)
- `subcategory`: String
- `date`: Date (required)
- `description`: String
- `notes`: String
- `tags`: Array of Strings
- `paymentMethod`: String (enum)
- `isRecurring`: Boolean
- `recurringFrequency`: String
- `status`: String (enum: 'pending', 'completed', 'cancelled')
- `attachments`: Array of Objects

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Zod for validation
- bcrypt for password hashing
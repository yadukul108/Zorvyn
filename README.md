# Finance Dashboard API

A comprehensive Node.js/Express REST API for personal finance management with advanced analytics, role-based access control, and modern development practices.


## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-Based Access Control (RBAC)** with three predefined roles:
  - **Viewer**: Read-only access to personal data
  - **Analyst**: Read access to all data + transaction management
  - **Admin**: Full system access including user/role management
- **Password hashing** with bcrypt
- **Session management** with automatic token refresh

### 💰 Transaction Management
- **CRUD operations** for financial transactions
- **Transaction types**: Income and Expense
- **Rich categorization**: Categories, subcategories, and tags
- **Payment methods** support (Cash, Credit Card, Bank Transfer, etc.)
- **Recurring transactions** with frequency settings
- **Soft delete** functionality with restore capability
- **Advanced filtering** by date, category, type, and amount

### 📊 Analytics & Dashboard
- **Dashboard Summary**: Income, expenses, and balance calculations
- **Category Analytics**: Spending breakdown by categories
- **Monthly Trends**: Year-over-year transaction analysis
- **Date range filtering** for all analytics
- **Real-time calculations** with optimized aggregation queries

### 🧹 Data Management
- **Automatic Cleanup**: Scheduled removal of old soft-deleted records
- **Configurable Retention**: Set retention period for deleted data (default: 30 days)
- **Admin Controls**: Manual cleanup triggers and statistics monitoring
- **Safe Deletion**: Permanent removal only after retention period

### 🛠️ Developer Experience
- **Comprehensive API documentation** with Swagger UI
- **HTTP request logging** with Morgan
- **Input validation** using Joi and Zod schemas
- **Error handling** with structured responses
- **ES6 modules** with modern JavaScript syntax
- **Code linting** with ESLint and Prettier
- **Environment-based configuration**

## 🏗️ Architecture

### Project Structure
```
src/
├── config/           # Database and configuration
│   └── db.js        # MongoDB connection and seeding
├── controllers/     # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── roleController.js
│   ├── transactionController.js
│   └── adminController.js
├── middlewares/     # Express middlewares
│   ├── auth.js      # JWT authentication
│   ├── rbac.js      # Role-based access control
│   ├── validate.js  # Request validation
│   └── errorHandler.js
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Role.js
│   └── Transaction.js
├── routes/          # API route definitions
│   ├── auth.js
│   ├── users.js
│   ├── roles.js
│   ├── transactions.js
│   └── admin.js
├── services/        # Business logic layer
│   ├── authService.js
│   ├── userService.js
│   ├── roleService.js
│   ├── transactionService.js
│   └── cleanupService.js
├── utils/           # Utility functions
│   ├── constants.js
│   ├── errors.js
│   ├── responses.js
│   ├── logger.js
│   └── scheduler.js
├── validators/      # Validation schemas
│   └── schemas.js
├── app.js           # Express app configuration
└── index.js         # Application entry point
```

### Design Patterns
- **MVC Architecture**: Clear separation of concerns
- **Service Layer**: Business logic abstracted from controllers
- **Middleware Pattern**: Request processing pipeline
- **Repository Pattern**: Data access abstraction
- **Validation Layer**: Input sanitization and validation

### Security Features
- **Password hashing** with bcrypt (12 salt rounds)
- **JWT tokens** with configurable expiration
- **Input validation** to prevent injection attacks
- **CORS protection** and security headers
- **Rate limiting** considerations (extensible)
- **Soft delete** for data recovery

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **MongoDB** 7.0 or higher (local or cloud instance)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finance-dashboard-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/finance-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cleanup Configuration
CLEANUP_RETENTION_DAYS=30
CLEANUP_INTERVAL_HOURS=24
CLEANUP_ENABLED=true

# Optional: External Services
# REDIS_URL=redis://localhost:6379
# EMAIL_SERVICE_API_KEY=your-email-service-key
```

### 4. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Interactive Documentation
Access the Swagger UI documentation at:
```
http://localhost:5000/api-docs
```

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication
```
POST /api/auth/register  - User registration
POST /api/auth/login     - User login
GET  /api/auth/profile   - Get user profile
```

#### User Management (Admin only)
```
GET    /api/users         - List all users
GET    /api/users/:id     - Get user by ID
POST   /api/users         - Create user
PUT    /api/users/:id     - Update user
DELETE /api/users/:id     - Soft delete user
PATCH  /api/users/:id/restore - Restore user
GET    /api/users/deleted - List deleted users
```

#### Transaction Management
```
GET    /api/transactions                    - List transactions (with filtering)
GET    /api/transactions/:id               - Get transaction by ID
POST   /api/transactions                   - Create transaction
PUT    /api/transactions/:id               - Update transaction
DELETE /api/transactions/:id               - Soft delete transaction
PATCH  /api/transactions/:id/restore       - Restore transaction
GET    /api/transactions/deleted           - List deleted transactions
```

#### Analytics (Analyst+ roles)
```
GET /api/transactions/analytics/dashboard   - Dashboard summary
GET /api/transactions/analytics/categories  - Category breakdown
GET /api/transactions/analytics/trends/:year - Monthly trends
```

#### Role Management (Admin only)
```
GET    /api/roles         - List all roles
POST   /api/roles         - Create role
PUT    /api/roles/:id     - Update role
DELETE /api/roles/:id     - Soft delete role
PATCH  /api/roles/:id/restore - Restore role
GET    /api/roles/deleted - List deleted roles
```

## 🔧 Development

### Available Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm run lint   # Run ESLint
npm run format # Format code with Prettier
```

### Code Quality
- **ESLint**: JavaScript linting with Airbnb config
- **Prettier**: Code formatting
- **EditorConfig**: Consistent coding styles

### Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Considerations

### Environment Variables
- Store all secrets in environment variables
- Use strong, unique JWT secrets
- Never commit `.env` files to version control

### Data Protection
- Passwords hashed with bcrypt (12 rounds)
- Soft delete preserves data integrity
- Input validation prevents injection attacks

### API Security
- JWT tokens with expiration
- Role-based access control
- Request validation and sanitization

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: ObjectId (ref: 'Role'),
  status: Enum ['active', 'inactive', 'suspended'],
  lastLogin: Date,
  profile: {
    avatar: String,
    phone: String,
    department: String
  },
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  amount: Number (required, positive),
  type: Enum ['income', 'expense'] (required),
  category: String (required),
  subcategory: String,
  date: Date (default: now),
  description: String,
  notes: String,
  tags: [String],
  paymentMethod: String,
  isRecurring: Boolean,
  recurringFrequency: String,
  status: Enum ['pending', 'completed', 'cancelled'],
  user: ObjectId (ref: 'User'),
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Role Model
```javascript
{
  name: Enum ['Viewer', 'Analyst', 'Admin'] (required),
  description: String,
  permissions: [String],
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Use conventional commit format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the code comments for implementation details

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-production-db-uri
JWT_SECRET=your-production-jwt-secret
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start src/index.js --name "finance-dashboard"
pm2 startup
pm2 save
```

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**
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

### Admin Operations (Admin only)
- `GET /api/admin/cleanup/stats` - Get cleanup statistics and scheduler status
- `GET /api/admin/cleanup/preview` - Preview what would be cleaned up
- `GET /api/admin/cleanup/status` - Get scheduler status
- `POST /api/admin/cleanup/run` - Manually trigger cleanup

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
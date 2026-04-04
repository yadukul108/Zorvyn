import express from 'express';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import transactionRoutes from './routes/transactions.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// middleware
app.use(express.json());
app.use(morgan('combined'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'API documentation for the Finance Dashboard application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            role: {
              $ref: '#/components/schemas/Role',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'User account status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Role ID',
            },
            name: {
              type: 'string',
              enum: ['Viewer', 'Analyst', 'Admin'],
              description: 'Role name',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of permissions for this role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Role creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Transaction ID',
            },
            amount: {
              type: 'number',
              description: 'Transaction amount',
            },
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Transaction type',
            },
            category: {
              type: 'string',
              description: 'Transaction category',
            },
            description: {
              type: 'string',
              description: 'Transaction description',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Transaction date',
            },
            user: {
              type: 'string',
              description: 'User ID who created the transaction',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// centralized error handling
app.use(errorHandler);

export default app;

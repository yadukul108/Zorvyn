import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import transactionRoutes from './routes/transactions.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/transactions', transactionRoutes);

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// centralized error handling
app.use(errorHandler);

export default app;

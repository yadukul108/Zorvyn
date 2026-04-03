import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;

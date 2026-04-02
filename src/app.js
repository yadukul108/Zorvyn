import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;

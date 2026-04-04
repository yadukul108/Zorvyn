import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import scheduler from './utils/scheduler.js';
import { SERVER_CONFIG } from './utils/constants.js';

const PORT = SERVER_CONFIG.PORT;

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  scheduler.stop();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      // Start the cleanup scheduler
      scheduler.start();
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

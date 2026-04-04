/**
 * Structured logging utility
 */

import { SERVER_CONFIG } from './constants.js';

class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    this.currentLevel = this.levels[process.env.LOG_LEVEL || 'info'];
  }

  _shouldLog(level) {
    return this.levels[level] <= this.currentLevel;
  }

  _formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    if (SERVER_CONFIG.NODE_ENV === 'development') {
      return JSON.stringify(logEntry, null, 2);
    }

    return JSON.stringify(logEntry);
  }

  error(message, meta = {}) {
    if (this._shouldLog('error')) {
      console.error(this._formatMessage('error', message, meta));
    }
  }

  warn(message, meta = {}) {
    if (this._shouldLog('warn')) {
      console.warn(this._formatMessage('warn', message, meta));
    }
  }

  info(message, meta = {}) {
    if (this._shouldLog('info')) {
      console.log(this._formatMessage('info', message, meta));
    }
  }

  debug(message, meta = {}) {
    if (this._shouldLog('debug')) {
      console.debug(this._formatMessage('debug', message, meta));
    }
  }

  // Specialized logging methods
  logRequest(req, res, responseTime) {
    this.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  }

  logError(error, req = null) {
    const meta = {
      error: error.message,
      stack: error.stack,
    };

    if (req) {
      meta.method = req.method;
      meta.url = req.originalUrl;
      meta.userId = req.user?.id;
    }

    this.error('Application Error', meta);
  }

  logDatabase(operation, collection, duration, success = true) {
    this.info('Database Operation', {
      operation,
      collection,
      duration: `${duration}ms`,
      success,
    });
  }
}

export default new Logger();
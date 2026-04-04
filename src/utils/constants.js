// Application constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'check',
  'other',
];

export const USER_ROLES = {
  VIEWER: 'Viewer',
  ANALYST: 'Analyst',
  ADMIN: 'Admin',
};

export const PERMISSIONS = {
  // Transaction permissions
  TRANSACTION_READ_OWN: 'transaction:read:own',
  TRANSACTION_READ_ALL: 'transaction:read:all',
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_UPDATE_OWN: 'transaction:update:own',
  TRANSACTION_UPDATE_ALL: 'transaction:update:all',
  TRANSACTION_DELETE_OWN: 'transaction:delete:own',
  TRANSACTION_DELETE_ALL: 'transaction:delete:all',
  TRANSACTION_ANALYTICS: 'transaction:analytics',

  // User management permissions
  USER_READ_OWN: 'user:read:own',
  USER_READ_ALL: 'user:read:all',
  USER_CREATE: 'user:create',
  USER_UPDATE_OWN: 'user:update:own',
  USER_UPDATE_ALL: 'user:update:all',
  USER_DELETE: 'user:delete',
  USER_ASSIGN_ROLE: 'user:assign_role',
  USER_UPDATE_STATUS: 'user:update_status',

  // Role management permissions
  ROLE_READ: 'role:read',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
};

export const DEFAULT_ROLES = [
  {
    name: USER_ROLES.VIEWER,
    description: 'Can view data only.',
    permissions: ['view'],
  },
  {
    name: USER_ROLES.ANALYST,
    description: 'Can view and comment on data.',
    permissions: ['view', 'comment'],
  },
  {
    name: USER_ROLES.ADMIN,
    description: 'Full access to manage users and settings.',
    permissions: ['view', 'comment', 'manage'],
  },
];

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export const DB_CONFIG = {
  URI: process.env.MONGO_URI || 'mongodb://localhost:27017/finance-dashboard',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const BCRYPT_CONFIG = {
  SALT_ROUNDS: 12,
};

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CLEANUP_CONFIG = {
  // Days to keep soft-deleted records before permanent deletion
  RETENTION_DAYS: parseInt(process.env.CLEANUP_RETENTION_DAYS) || 30,
  // Run cleanup job every N hours
  INTERVAL_HOURS: parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24,
  // Enable/disable cleanup job
  ENABLED: process.env.CLEANUP_ENABLED !== 'false',
};
import RBACService from '../services/rbacService.js';

const authorize = (permission) => {
  return async (req, res, next) => {
    try {
      await RBACService.checkPermission(req.user, permission);
      next();
    } catch (error) {
      return res.status(403).json({
        error: 'Access denied',
        message: error.message,
        requiredPermission: permission
      });
    }
  };
};

// Predefined middleware functions for common permissions
const rbacMiddleware = {
  // Transaction permissions
  canReadOwnTransactions: authorize('transaction:read:own'),
  canReadAllTransactions: authorize('transaction:read:all'),
  canCreateTransaction: authorize('transaction:create'),
  canUpdateOwnTransaction: authorize('transaction:update:own'),
  canUpdateAllTransactions: authorize('transaction:update:all'),
  canDeleteOwnTransaction: authorize('transaction:delete:own'),
  canDeleteAllTransactions: authorize('transaction:delete:all'),
  canAccessAnalytics: authorize('transaction:analytics'),

  // User management permissions
  canReadOwnUser: authorize('user:read:own'),
  canReadAllUsers: authorize('user:read:all'),
  canCreateUser: authorize('user:create'),
  canUpdateOwnUser: authorize('user:update:own'),
  canUpdateAllUsers: authorize('user:update:all'),
  canDeleteUser: authorize('user:delete'),
  canAssignRole: authorize('user:assign_role'),
  canUpdateUserStatus: authorize('user:update_status'),

  // Role management permissions
  canReadRoles: authorize('role:read'),
  canCreateRole: authorize('role:create'),
  canUpdateRole: authorize('role:update'),
  canDeleteRole: authorize('role:delete'),

  // Generic authorize function for custom permissions
  authorize
};

export default rbacMiddleware;
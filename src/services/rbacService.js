import Role from '../models/Role.js';
import { PERMISSIONS, USER_ROLES } from '../utils/constants.js';
import { AuthorizationError } from '../utils/errors.js';

class RBACService {
  constructor() {
    this.permissions = {
      // Transaction permissions
      [PERMISSIONS.TRANSACTION_READ_OWN]: [USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_READ_ALL]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_CREATE]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_UPDATE_OWN]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_UPDATE_ALL]: [USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_DELETE_OWN]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_DELETE_ALL]: [USER_ROLES.ADMIN],
      [PERMISSIONS.TRANSACTION_ANALYTICS]: [USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN],

      // User management permissions
      [PERMISSIONS.USER_READ_OWN]: [USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.USER_READ_ALL]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.USER_CREATE]: [USER_ROLES.ADMIN],
      [PERMISSIONS.USER_UPDATE_OWN]: [USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.USER_UPDATE_ALL]: [USER_ROLES.ADMIN],
      [PERMISSIONS.USER_DELETE]: [USER_ROLES.ADMIN],
      [PERMISSIONS.USER_ASSIGN_ROLE]: [USER_ROLES.ADMIN],
      [PERMISSIONS.USER_UPDATE_STATUS]: [USER_ROLES.ADMIN],

      // Role management permissions
      [PERMISSIONS.ROLE_READ]: [USER_ROLES.ANALYST, USER_ROLES.ADMIN],
      [PERMISSIONS.ROLE_CREATE]: [USER_ROLES.ADMIN],
      [PERMISSIONS.ROLE_UPDATE]: [USER_ROLES.ADMIN],
      [PERMISSIONS.ROLE_DELETE]: [USER_ROLES.ADMIN],
    };
  }

  /**
   * Check if user has specific permission
   * @param {object} user - User object with role
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>}
   */
  async hasPermission(user, permission) {
    if (!user || !user.role) {
      return false;
    }

    const userRole = user.role.name;
    const allowedRoles = this.permissions[permission];

    if (!allowedRoles) {
      return false;
    }

    return allowedRoles.includes(userRole);
  }

  /**
   * Check permission and throw error if access denied
   * @param {object} user - User object with role
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>}
   * @throws {AuthorizationError}
   */
  async checkPermission(user, permission) {
    const hasAccess = await this.hasPermission(user, permission);

    if (!hasAccess) {
      throw new AuthorizationError(
        `Access denied. Required permission: ${permission}`,
        permission
      );
    }

    return true;
  }

  /**
   * Get all permissions for a user
   * @param {object} user - User object with role
   * @returns {Promise<array>} Array of permission strings
   */
  async getUserPermissions(user) {
    if (!user || !user.role) {
      return [];
    }

    const userRole = user.role.name;
    const userPermissions = [];

    for (const [permission, allowedRoles] of Object.entries(this.permissions)) {
      if (allowedRoles.includes(userRole)) {
        userPermissions.push(permission);
      }
    }

    return userPermissions;
  }

  // Convenience methods for transaction permissions
  async canReadAllTransactions(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_READ_ALL);
  }

  async canReadOwnTransactions(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_READ_OWN);
  }

  async canCreateTransaction(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_CREATE);
  }

  async canUpdateOwnTransaction(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_UPDATE_OWN);
  }

  async canUpdateAllTransactions(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_UPDATE_ALL);
  }

  async canDeleteOwnTransaction(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_DELETE_OWN);
  }

  async canDeleteAllTransactions(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_DELETE_ALL);
  }

  async canAccessAnalytics(user) {
    return this.hasPermission(user, PERMISSIONS.TRANSACTION_ANALYTICS);
  }

  // Convenience methods for user permissions
  async canReadAllUsers(user) {
    return this.hasPermission(user, PERMISSIONS.USER_READ_ALL);
  }

  async canReadOwnUser(user) {
    return this.hasPermission(user, PERMISSIONS.USER_READ_OWN);
  }

  async canCreateUser(user) {
    return this.hasPermission(user, PERMISSIONS.USER_CREATE);
  }

  async canUpdateOwnUser(user) {
    return this.hasPermission(user, PERMISSIONS.USER_UPDATE_OWN);
  }

  async canUpdateAllUsers(user) {
    return this.hasPermission(user, PERMISSIONS.USER_UPDATE_ALL);
  }

  async canDeleteUser(user) {
    return this.hasPermission(user, PERMISSIONS.USER_DELETE);
  }

  async canAssignRole(user) {
    return this.hasPermission(user, PERMISSIONS.USER_ASSIGN_ROLE);
  }

  async canUpdateUserStatus(user) {
    return this.hasPermission(user, PERMISSIONS.USER_UPDATE_STATUS);
  }

  // Convenience methods for role permissions
  async canReadRoles(user) {
    return this.hasPermission(user, PERMISSIONS.ROLE_READ);
  }

  async canCreateRole(user) {
    return this.hasPermission(user, PERMISSIONS.ROLE_CREATE);
  }

  async canUpdateRole(user) {
    return this.hasPermission(user, PERMISSIONS.ROLE_UPDATE);
  }

  async canDeleteRole(user) {
    return this.hasPermission(user, PERMISSIONS.ROLE_DELETE);
  }
}

export default new RBACService();
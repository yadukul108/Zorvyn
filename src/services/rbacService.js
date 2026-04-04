import Role from '../models/Role.js';

class RBACService {
  constructor() {
    this.permissions = {
      // Transaction permissions
      'transaction:read:own': ['Viewer', 'Analyst', 'Admin'],
      'transaction:read:all': ['Analyst', 'Admin'],
      'transaction:create': ['Analyst', 'Admin'],
      'transaction:update:own': ['Analyst', 'Admin'],
      'transaction:update:all': ['Admin'],
      'transaction:delete:own': ['Analyst', 'Admin'],
      'transaction:delete:all': ['Admin'],
      'transaction:analytics': ['Viewer', 'Analyst', 'Admin'],

      // User management permissions
      'user:read:own': ['Viewer', 'Analyst', 'Admin'],
      'user:read:all': ['Analyst', 'Admin'],
      'user:create': ['Admin'],
      'user:update:own': ['Viewer', 'Analyst', 'Admin'],
      'user:update:all': ['Admin'],
      'user:delete': ['Admin'],
      'user:assign_role': ['Admin'],
      'user:update_status': ['Admin'],

      // Role management permissions
      'role:read': ['Analyst', 'Admin'],
      'role:create': ['Admin'],
      'role:update': ['Admin'],
      'role:delete': ['Admin']
    };
  }

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

  async checkPermission(user, permission) {
    const hasAccess = await this.hasPermission(user, permission);
    if (!hasAccess) {
      throw new Error(`Access denied. Required permission: ${permission}`);
    }
    return true;
  }

  // Helper methods for common checks
  async canReadOwnTransactions(user) {
    return this.hasPermission(user, 'transaction:read:own');
  }

  async canReadAllTransactions(user) {
    return this.hasPermission(user, 'transaction:read:all');
  }

  async canCreateTransaction(user) {
    return this.hasPermission(user, 'transaction:create');
  }

  async canUpdateOwnTransaction(user) {
    return this.hasPermission(user, 'transaction:update:own');
  }

  async canUpdateAllTransactions(user) {
    return this.hasPermission(user, 'transaction:update:all');
  }

  async canDeleteOwnTransaction(user) {
    return this.hasPermission(user, 'transaction:delete:own');
  }

  async canDeleteAllTransactions(user) {
    return this.hasPermission(user, 'transaction:delete:all');
  }

  async canAccessAnalytics(user) {
    return this.hasPermission(user, 'transaction:analytics');
  }

  async canReadOwnUser(user) {
    return this.hasPermission(user, 'user:read:own');
  }

  async canReadAllUsers(user) {
    return this.hasPermission(user, 'user:read:all');
  }

  async canCreateUser(user) {
    return this.hasPermission(user, 'user:create');
  }

  async canUpdateOwnUser(user) {
    return this.hasPermission(user, 'user:update:own');
  }

  async canUpdateAllUsers(user) {
    return this.hasPermission(user, 'user:update:all');
  }

  async canDeleteUser(user) {
    return this.hasPermission(user, 'user:delete');
  }

  async canAssignRole(user) {
    return this.hasPermission(user, 'user:assign_role');
  }

  async canUpdateUserStatus(user) {
    return this.hasPermission(user, 'user:update_status');
  }

  async canReadRoles(user) {
    return this.hasPermission(user, 'role:read');
  }

  async canCreateRole(user) {
    return this.hasPermission(user, 'role:create');
  }

  async canUpdateRole(user) {
    return this.hasPermission(user, 'role:update');
  }

  async canDeleteRole(user) {
    return this.hasPermission(user, 'role:delete');
  }
}

export default new RBACService();
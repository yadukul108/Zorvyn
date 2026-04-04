import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Role from '../models/Role.js';
import logger from '../utils/logger.js';
import { 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  DatabaseError,
  ValidationError 
} from '../utils/errors.js';
import { USER_ROLES } from '../utils/constants.js';

class UserService {
  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      logger.error('Error hashing password', { error: error.message });
      throw new DatabaseError('Failed to hash password');
    }
  }

  /**
   * Compare plain password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>}
   */
  async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      logger.error('Error comparing passwords', { error: error.message });
      throw new DatabaseError('Failed to compare passwords');
    }
  }

  /**
   * Get all active users with optional filtering
   * @param {object} filter - Query filter object
   * @param {number} page - Page number for pagination
   * @param {number} limit - Items per page
   * @returns {Promise<{users: array, total: number, pages: number}>}
   */
  async getAllUsers(filter = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = { ...filter, deletedAt: null };

      const [users, total] = await Promise.all([
        User.find(query)
          .populate('role', '-__v')
          .select('-password')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(query)
      ]);

      logger.debug('Retrieved users from database', { count: users.length, total });
      return {
        users,
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error retrieving users', { error: error.message });
      throw new DatabaseError('Failed to retrieve users');
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} User object
   */
  async getUserById(userId) {
    try {
      const user = await User.findOne({ _id: userId, deletedAt: null })
        .populate('role', '-__v')
        .select('-password');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error retrieving user by ID', { userId, error: error.message });
      throw new DatabaseError('Failed to retrieve user');
    }
  }

  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Created user object
   */
  async createUser(userData) {
    try {
      const { name, email, password, role, status, profile } = userData;

      // Validate required fields
      if (!name || !email || !password) {
        throw new ValidationError('Name, email and password are required');
      }

      // Check if user already exists
      const existing = await User.findOne({ email });
      if (existing && !existing.deletedAt) {
        throw new ConflictError('User with this email already exists');
      }

      // Determine role
      let roleId = role;
      if (!roleId) {
        const defaultRole = await Role.findOne({ name: USER_ROLES.VIEWER });
        if (!defaultRole) {
          throw new NotFoundError('Default role not found. Please create roles in the system.');
        }
        roleId = defaultRole._id;
      } else {
        const foundRole = await Role.findById(roleId);
        if (!foundRole) {
          throw new NotFoundError('Role not found');
        }
        roleId = foundRole._id;
      }

      // Hash password and create user
      const hashedPassword = await this.hashPassword(password);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: roleId,
        status: status || 'active',
        profile: profile || {}
      });

      await user.save();
      logger.info('User created successfully', { userId: user._id, email });
      return await this.getUserById(user._id);
    } catch (error) {
      if (error instanceof (ConflictError || NotFoundError)) throw error;
      logger.error('Error creating user', { email: userData.email, error: error.message });
      throw new DatabaseError('Failed to create user');
    }
  }

  /**
   * Update user information
   * @param {string} userId - User ID to update
   * @param {object} payload - Data to update
   * @returns {Promise<object>} Updated user object
   */
  async updateUser(userId, payload) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Update email if provided
      if (payload.email && payload.email !== user.email) {
        const exists = await User.findOne({ email: payload.email, deletedAt: null });
        if (exists) {
          throw new ConflictError('Email already in use');
        }
        user.email = payload.email;
      }

      // Update basic fields
      if (payload.name) user.name = payload.name;
      if (payload.profile) user.profile = { ...user.profile, ...payload.profile };

      // Update password
      if (payload.password) {
        user.password = await this.hashPassword(payload.password);
      }

      // Update role
      if (payload.role) {
        const role = await Role.findById(payload.role);
        if (!role) {
          throw new NotFoundError('Role not found');
        }
        user.role = role._id;
      }

      // Update status
      if (payload.status) {
        const allowed = ['active', 'inactive', 'suspended'];
        if (!allowed.includes(payload.status)) {
          throw new ValidationError('Invalid status value');
        }
        user.status = payload.status;
      }

      await user.save();
      logger.info('User updated successfully', { userId });
      return await this.getUserById(user._id);
    } catch (error) {
      if (error instanceof (NotFoundError || ConflictError || ValidationError)) throw error;
      logger.error('Error updating user', { userId, error: error.message });
      throw new DatabaseError('Failed to update user');
    }
  }

  /**
   * Soft delete user
   * @param {string} userId - User ID to delete
   * @returns {Promise<object>} Deleted user object
   */
  async deleteUser(userId) {
    try {
      const user = await User.findOne({ _id: userId, deletedAt: null });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.deletedAt = new Date();
      await user.save();
      logger.info('User deleted successfully', { userId });
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error deleting user', { userId, error: error.message });
      throw new DatabaseError('Failed to delete user');
    }
  }

  /**
   * Restore soft deleted user
   * @param {string} userId - User ID to restore
   * @returns {Promise<object>} Restored user object
   */
  async restoreUser(userId) {
    try {
      const user = await User.findOne({ _id: userId, deletedAt: { $ne: null } });
      if (!user) {
        throw new NotFoundError('User not found or not deleted');
      }

      user.deletedAt = null;
      await user.save();
      logger.info('User restored successfully', { userId });
      return await this.getUserById(user._id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error restoring user', { userId, error: error.message });
      throw new DatabaseError('Failed to restore user');
    }
  }

  /**
   * Get all soft deleted users
   * @returns {Promise<array>} Array of deleted users
   */
  async getDeletedUsers() {
    try {
      const users = await User.find({ deletedAt: { $ne: null } })
        .populate('role', '-__v')
        .select('-password');

      logger.debug('Retrieved deleted users', { count: users.length });
      return users;
    } catch (error) {
      logger.error('Error retrieving deleted users', { error: error.message });
      throw new DatabaseError('Failed to retrieve deleted users');
    }
  }

  /**
   * Assign role to user
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID to assign
   * @returns {Promise<object>} Updated user object
   */
  async assignRole(userId, roleId) {
    return await this.updateUser(userId, { role: roleId });
  }

  /**
   * Set user status
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated user object
   */
  async setStatus(userId, status) {
    return await this.updateUser(userId, { status });
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<object>} User object including password for auth
   */
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email, deletedAt: null }).populate('role', '-__v');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error retrieving user by email', { email, error: error.message });
      throw new DatabaseError('Failed to retrieve user');
    }
  }

  /**
   * Update last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    try {
      await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
      logger.debug('Updated last login for user', { userId });
    } catch (error) {
      logger.error('Error updating last login', { userId, error: error.message });
      // Don't throw here as this is a non-critical operation
    }
  }
}

export default new UserService();

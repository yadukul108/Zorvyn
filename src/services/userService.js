import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Role from '../models/Role.js';

class UserService {
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async getAllUsers(filter = {}) {
    return await User.find(filter).populate('role', '-__v').select('-password');
  }

  async getUserById(userId) {
    return await User.findById(userId).populate('role', '-__v').select('-password');
  }

  async createUser(userData) {
    const { name, email, password, role, status, profile } = userData;

    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('User already exists');
    }

    let roleId = role;
    if (!roleId) {
      const defaultRole = await Role.findOne({ name: 'Viewer' });
      if (!defaultRole) {
        throw new Error('Default role not found. Please create roles in the system.');
      }
      roleId = defaultRole._id;
    } else {
      const foundRole = await Role.findById(roleId);
      if (!foundRole) {
        throw new Error('Role not found');
      }
      roleId = foundRole._id;
    }

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
    return await this.getUserById(user._id);
  }

  async updateUser(userId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (payload.email && payload.email !== user.email) {
      const exists = await User.findOne({ email: payload.email });
      if (exists) {
        throw new Error('Email already in use');
      }
      user.email = payload.email;
    }

    if (payload.name) user.name = payload.name;
    if (payload.profile) user.profile = { ...user.profile, ...payload.profile };

    if (payload.password) {
      user.password = await this.hashPassword(payload.password);
    }

    if (payload.role) {
      const role = await Role.findById(payload.role);
      if (!role) {
        throw new Error('Role not found');
      }
      user.role = role._id;
    }

    if (payload.status) {
      const allowed = ['active', 'inactive', 'suspended'];
      if (!allowed.includes(payload.status)) {
        throw new Error('Invalid status value');
      }
      user.status = payload.status;
    }

    await user.save();
    return await this.getUserById(user._id);
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async assignRole(userId, roleId) {
    return await this.updateUser(userId, { role: roleId });
  }

  async setStatus(userId, status) {
    return await this.updateUser(userId, { status });
  }
}

export default new UserService();
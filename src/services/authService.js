import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

class AuthService {
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'aditya123456',
      { expiresIn: '24h' }
    );
  }

  async register(userData) {
    const { name, email, password, role } = userData;

    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Determine role
    let roleId = role;
    if (!roleId) {
      const defaultRole = await Role.findOne({ name: 'Viewer' });
      if (!defaultRole) {
        throw new Error('Default role not found. Please create roles first.');
      }
      roleId = defaultRole._id;
    } else {
      const roleExists = await Role.findById(roleId);
      if (!roleExists) {
        throw new Error('Role not found');
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: roleId
    });

    await user.save();
    return await this.getUserById(user._id);
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getUserById(userId) {
    return await User.findById(userId).populate('role');
  }
}

export default new AuthService();
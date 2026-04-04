import UserService from '../services/userService.js';
import RBACService from '../services/rbacService.js';

class UserController {
  async listUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user can access this profile
      const isOwnProfile = req.params.id === req.user._id.toString();
      const canReadAll = await RBACService.canReadAllUsers(req.user);

      if (!isOwnProfile && !canReadAll) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ message: 'User created', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      // Check if user can update this profile
      const isOwnProfile = req.params.id === req.user._id.toString();
      const canUpdateAll = await RBACService.canUpdateAllUsers(req.user);
      const canUpdateOwn = await RBACService.canUpdateOwnUser(req.user);

      if (!isOwnProfile && !canUpdateAll) {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (isOwnProfile && !canUpdateOwn && !canUpdateAll) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({ message: 'User updated', user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
  async restoreUser(req, res) {
    try {
      const user = await UserService.restoreUser(req.params.id);
      res.json({ message: 'User restored successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeletedUsers(req, res) {
    try {
      const users = await UserService.getDeletedUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async assignRole(req, res) {
    try {
      const { roleId } = req.body;
      if (!roleId) {
        return res.status(400).json({ error: 'roleId is required' });
      }

      const user = await UserService.assignRole(req.params.id, roleId);
      res.json({ message: 'Role assigned', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'status is required' });
      }

      const user = await UserService.setStatus(req.params.id, status);
      res.json({ message: 'Status updated', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
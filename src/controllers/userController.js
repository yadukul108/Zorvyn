import UserService from '../services/userService.js';

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
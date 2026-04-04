import RoleService from '../services/roleService.js';

class RoleController {
  async listRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      res.json({ roles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRole(req, res) {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json({ message: 'Role created', role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateRole(req, res) {
    try {
      const role = await RoleService.updateRole(req.params.id, req.body);
      res.json({ message: 'Role updated successfully', role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      await RoleService.deleteRole(req.params.id);
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async restoreRole(req, res) {
    try {
      const role = await RoleService.restoreRole(req.params.id);
      res.json({ message: 'Role restored successfully', role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeletedRoles(req, res) {
    try {
      const roles = await RoleService.getDeletedRoles();
      res.json({ roles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }}

export default new RoleController();
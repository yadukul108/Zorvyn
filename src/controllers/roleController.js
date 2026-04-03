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
}

export default new RoleController();
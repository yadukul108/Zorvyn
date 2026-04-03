import Role from '../models/Role.js';

class RoleService {
  async getAllRoles() {
    return await Role.find({});
  }

  async getRoleById(roleId) {
    return await Role.findById(roleId);
  }

  async getRoleByName(name) {
    return await Role.findOne({ name });
  }

  async createRole(roleData) {
    if (!roleData.name) {
      throw new Error('Role name is required');
    }

    const exists = await Role.findOne({ name: roleData.name });
    if (exists) {
      throw new Error('Role already exists');
    }

    const role = new Role(roleData);
    await role.save();
    return role;
  }
}

export default new RoleService();
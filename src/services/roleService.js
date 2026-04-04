import Role from '../models/Role.js';

class RoleService {
  async getAllRoles() {
    return await Role.find({ deletedAt: null });
  }

  async getRoleById(roleId) {
    return await Role.findOne({ _id: roleId, deletedAt: null });
  }

  async getRoleByName(name) {
    return await Role.findOne({ name, deletedAt: null });
  }

  async createRole(roleData) {
    if (!roleData.name) {
      throw new Error('Role name is required');
    }

    const exists = await Role.findOne({ name: roleData.name, deletedAt: null });
    if (exists) {
      throw new Error('Role already exists');
    }

    const role = new Role(roleData);
    await role.save();
    return role;
  }

  async updateRole(roleId, roleData) {
    const role = await Role.findOne({ _id: roleId, deletedAt: null });
    if (!role) {
      throw new Error('Role not found');
    }

    Object.assign(role, roleData);
    await role.save();
    return role;
  }

  async deleteRole(roleId) {
    const role = await Role.findOne({ _id: roleId, deletedAt: null });
    if (!role) {
      throw new Error('Role not found');
    }

    role.deletedAt = new Date();
    await role.save();
    return role;
  }

  async restoreRole(id) {
    const role = await Role.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    role.deletedAt = null;
    await role.save();
    return role;
  }

  async getDeletedRoles() {
    return await Role.find({ deletedAt: { $ne: null } });
  }

  async restoreRole(roleId) {
    const role = await Role.findOne({ _id: roleId, deletedAt: { $ne: null } });
    if (!role) {
      throw new Error('Role not found or not deleted');
    }

    role.deletedAt = null;
    await role.save();
    return role;
  }

  async getDeletedRoles() {
    return await Role.find({ deletedAt: { $ne: null } });
  }
}

export default new RoleService();
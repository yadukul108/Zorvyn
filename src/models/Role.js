import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Viewer', 'Analyst', 'Admin']
  },
  description: String,
  permissions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  profile: {
    avatar: String,
    phone: String,
    department: String
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
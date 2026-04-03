import mongoose from 'mongoose';
import Role from '../models/Role.js';

const seedDefaultRoles = async () => {
  const existing = await Role.find({ name: { $in: ['Viewer', 'Analyst', 'Admin'] } });
  const existingNames = existing.map((r) => r.name);

  const defaults = [
    { name: 'Viewer', description: 'Can view data only.', permissions: ['view'] },
    { name: 'Analyst', description: 'Can view and comment on data.', permissions: ['view', 'comment'] },
    { name: 'Admin', description: 'Full access to manage users and settings.', permissions: ['view', 'comment', 'manage'] }
  ];

  for (const roleData of defaults) {
    if (!existingNames.includes(roleData.name)) {
      await Role.create(roleData);
      console.log(`Created role ${roleData.name}`);
    }
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-dashboard';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');

  await seedDefaultRoles();
};

export default connectDB;

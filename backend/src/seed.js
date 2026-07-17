import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

await connectDB();
const accounts = [
  { name: 'Admin Demo', email: 'admin@assignment.com', password: 'Admin@123', role: 'admin' },
  { name: 'Sales Demo', email: 'sales@assignment.com', password: 'Sales@123', role: 'sales' },
  { name: 'Customer Demo', email: 'user@assignment.com', password: 'User@123', role: 'user' }
];
for (const account of accounts) {
  const existing = await User.findOne({ email: account.email });
  if (!existing) {
    const password = await bcrypt.hash(account.password, 10);
    await User.create({ ...account, password });
  }
}
console.log('Demo accounts are ready');
process.exit();

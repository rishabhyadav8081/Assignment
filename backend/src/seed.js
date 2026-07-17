import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

await connectDB();
const accounts = [
  { name: 'Admin Demo', email: 'admin@cartnest.com', password: 'Admin123!', role: 'admin' },
  { name: 'Sales Demo', email: 'sales@cartnest.com', password: 'Sales123!', role: 'sales' },
  { name: 'Customer Demo', email: 'user@cartnest.com', password: 'User123!', role: 'user' }
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

/**
 * Script to create an admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import mongoose from 'mongoose';
import User from '../models/User';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get admin details
    console.log('\n📝 Admin Account Setup\n');
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (existingAdmin) {
      console.log('\n⚠️  Admin with this email already exists.');
      const update = await question('Do you want to update the password? (y/n): ');
      if (update.toLowerCase() === 'y') {
        existingAdmin.password = password; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('✅ Admin password updated successfully');
      } else {
        console.log('❌ Operation cancelled');
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'admin',
    });

    await admin.save();
    console.log('\n✅ Admin user created successfully!');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n🔐 You can now login to the admin dashboard with these credentials.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
createAdmin().finally(() => {
  rl.close();
});


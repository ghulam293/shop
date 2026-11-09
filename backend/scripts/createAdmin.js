import argon2 from 'argon2';
import pool, { query } from '../config/db.js';

async function seedAdmin() {
  try {
    const adminEmail = 'admin@ipsoman.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@IPS2026!';
    const adminPhone = '+968 23 234567';

    console.log(`Checking existing admin user for ${adminEmail}...`);
    const existing = await query('SELECT id FROM users WHERE email = ?', [adminEmail]);

    const passwordHash = await argon2.hash(adminPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    let adminUserId;

    if (existing.length > 0) {
      adminUserId = existing[0].id;
      await query(
        `UPDATE users
         SET password_hash = ?, is_active = 1, email_verified = 1
         WHERE id = ?`,
        [passwordHash, adminUserId]
      );
      console.log(`Admin user password updated.`);
    } else {
      const [res] = await pool.execute(
        `INSERT INTO users (full_name, email, phone_number, password_hash, is_active, email_verified)
         VALUES ('IPS School Administrator', ?, ?, ?, 1, 1)`,
        [adminEmail, adminPhone, passwordHash]
      );
      adminUserId = res.insertId;
      console.log(`Admin user created with ID ${adminUserId}.`);
    }

    // Assign ADMIN role
    const roles = await query('SELECT id FROM roles WHERE name = ?', ['ADMIN']);
    if (roles.length > 0) {
      const adminRoleId = roles[0].id;
      await query(
        `INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [adminUserId, adminRoleId]
      );
      console.log(`Assigned ADMIN role successfully.`);
    }

    console.log(`====================================================`);
    console.log(` Admin account ready:`);
    console.log(` Email: ${adminEmail}`);
    console.log(` Password: ${adminPassword}`);
    console.log(`====================================================`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();


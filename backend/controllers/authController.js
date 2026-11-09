import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { query, transaction } from '../config/db.js';

export async function register(req, res, next) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      studentName,
      grade,
      classSection
    } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone number, and password are required.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.'
      });
    }

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    const result = await transaction(async (conn) => {
      // 1. Insert user
      const [userRes] = await conn.execute(
        `INSERT INTO users (full_name, email, phone_number, password_hash)
         VALUES (?, ?, ?, ?)`,
        [fullName.trim(), email.toLowerCase().trim(), phoneNumber.trim(), passwordHash]
      );
      const userId = userRes.insertId;

      // 2. Assign PARENT role (id = 3)
      await conn.execute(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT ?, id FROM roles WHERE name = 'PARENT'`,
        [userId]
      );

      // 3. Create active cart
      await conn.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);

      // 4. Optional student association
      if (studentName && grade) {
        const studentIdNum = `STU-${Date.now().toString().slice(-6)}`;
        const [studentRes] = await conn.execute(
          `INSERT INTO students (student_id_number, full_name, grade, class_section, gender)
           VALUES (?, ?, ?, ?, 'MALE')`,
          [studentIdNum, studentName.trim(), grade.trim(), (classSection || 'A').trim()]
        );
        const studentId = studentRes.insertId;

        await conn.execute(
          `INSERT INTO parent_students (parent_id, student_id, relationship)
           VALUES (?, ?, 'Parent')`,
          [userId, studentId]
        );
      }

      // 5. Audit Log
      await conn.execute(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
         VALUES (?, 'PARENT_REGISTERED', 'USER', ?, ?)`,
        [userId, userId.toString(), req.ip || null]
      );

      return { userId };
    });

    const token = jwt.sign(
      { userId: result.userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to IPS Oman School Shop!',
      token,
      user: {
        id: result.userId,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.trim(),
        roles: ['PARENT']
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const users = await query(
      `SELECT u.id, u.full_name, u.email, u.phone_number, u.password_hash, u.is_active,
              GROUP_CONCAT(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.email = ?
       GROUP BY u.id`,
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact school administration.'
      });
    }

    const isMatch = await argon2.verify(user.password_hash, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const roles = user.roles ? user.roles.split(',') : ['PARENT'];

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
       VALUES (?, 'USER_LOGIN', 'USER', ?, ?)`,
      [user.id, user.id.toString(), req.ip || null]
    );

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phoneNumber: user.phone_number,
        roles
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;

    // Fetch linked students
    const students = await query(
      `SELECT s.id, s.student_id_number, s.full_name, s.grade, s.class_section, s.gender, ps.relationship
       FROM parent_students ps
       JOIN students s ON ps.student_id = s.id
       WHERE ps.parent_id = ?`,
      [user.id]
    );

    res.json({
      success: true,
      user: {
        ...user,
        students
      }
    });
  } catch (error) {
    next(error);
  }
}


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-tc-secret-key-2026';

export const authController = {
  register: async (req, res) => {
    try {
      const { full_name, email, password, phone } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const existing = db.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        user_id: 'usr_' + Date.now(),
        full_name: full_name || 'User',
        email,
        phone: phone || '',
        password: passwordHash,
        role: 'User',
        created_at: new Date().toISOString()
      };

      db.createUser(newUser);

      const token = jwt.sign(
        { user_id: newUser.user_id, email: newUser.email, role: newUser.role, full_name: newUser.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { user_id: newUser.user_id, email: newUser.email, full_name: newUser.full_name, role: newUser.role }
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role, full_name: user.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: { user_id: user.user_id, email: user.email, full_name: user.full_name, role: user.role }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed: ' + err.message });
    }
  },

  getProfile: (req, res) => {
    return res.json({ user: req.user });
  }
};

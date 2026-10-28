import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { logAudit } from './auditService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'igkings-innovation-super-secure-jwt-secret-key-capstone-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const loginUser = async ({ email, password, ipAddress }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  await logAudit({
    userId: user.id,
    action: 'LOGIN',
    entity: 'Auth',
    entityId: user.id,
    details: `User ${user.email} logged in successfully`,
    ipAddress,
  });

  const sanitizedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };

  return { user: sanitizedUser, token };
};

export const logoutUser = async ({ userId, ipAddress }) => {
  if (userId) {
    await logAudit({
      userId,
      action: 'LOGOUT',
      entity: 'Auth',
      entityId: userId,
      details: 'User logged out',
      ipAddress,
    });
  }
};

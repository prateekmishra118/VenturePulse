import bcrypt from 'bcryptjs';
import { prisma } from '../database/prisma';
import { ApiError } from '../middleware/errorHandler';
import { signToken } from '../utils/jwt';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';

const SALT_ROUNDS = 12;

export interface AuthResult {
  user: { id: string; name: string; email: string };
  token: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash }
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Deliberately identical error for "no such user" and "wrong password" —
  // never reveal which one it was, that's a user-enumeration leak.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function getUserById(userId: string): Promise<{ id: string; name: string; email: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  return { id: user.id, name: user.name, email: user.email };
}

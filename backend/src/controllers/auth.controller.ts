import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';

export async function register(req: Request, res: Response): Promise<void> {
  const result = await registerUser(req.body as RegisterInput);
  sendSuccess(res, result, 'Account created successfully.', 201);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body as LoginInput);
  sendSuccess(res, result, 'Logged in successfully.');
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await getUserById(req.user!.userId);
  sendSuccess(res, user, 'Current user retrieved.');
}

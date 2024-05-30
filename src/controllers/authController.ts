import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register(name, email, password);
  res.status(201).json({ message: `Welcome ${user.name}. You are logged in`, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.status(200).json({ loggedInUser: user.name, token });
};

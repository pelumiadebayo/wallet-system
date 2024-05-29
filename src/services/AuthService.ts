import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export class AuthService {

  async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = new User({ name, email, password });
    await user.save();
    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: IUser): string {
    return jwt.sign({ id: user._id, email: user.email, name: user.name}, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }
}

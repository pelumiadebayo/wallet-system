import { Schema, model, Document } from 'mongoose';
import { hash , verify} from '../utils/hashing';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
    this.password = await hash(this.password);
  next();
});

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return verify(password, this.password);
};

export const User = model<IUser>('User', userSchema);
import mongoose, { Schema, model, Document } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';


interface IWallet extends Document {
  accountNumber: string;  //  wallet account identifier
  name: string; 
  userId: mongoose.Types.ObjectId; 
  balance: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema: Schema = new Schema({
  accountNumber: { type: String, default: () => generateCustomId(10), unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, required: true, default: 0 },
  name: { type: String, required: true },
  version: { type: Number, default: 0 },
}, {
  timestamps: true,
});

  
export const Wallet = model<IWallet>('Wallet', walletSchema);
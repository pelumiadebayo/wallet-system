import { Schema, model, Document, Types } from 'mongoose';

interface ITransaction extends Document {
  type: 'credit' | 'debit';
  amount: number;
  walletId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  type: { type: String, required: true, enum: ['credit', 'debit'] },
  amount: { type: Number, required: true },
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true }
}, { timestamps: true });

export const Transaction = model<ITransaction>('Transaction', transactionSchema);



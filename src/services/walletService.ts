import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import mongoose from 'mongoose';
import { retryWithTimeout } from '../utils/retryWithTimeout';

const DAILY_LIMIT = 10000; //  daily limit
const PER_TRANSACTION_LIMIT = 5000; // per-transaction limit


export class WalletService {

    async createWallet(userId: string, name: string) {
        return retryWithTimeout(async () => {

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const wallet = new Wallet({
                    userId,
                    name, 
                    balance: 0,
                    version: 0,
                });

                await wallet.save();
                await session.commitTransaction();

                return {
                    accountNumber: wallet.accountNumber, 
                    accountName: wallet.name
                };
            }catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
        
        }, 5, 1000, 2, 5000);
    }

    async creditWallet(accountNumber: string, amount: number) {
        return retryWithTimeout(async () => {

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const wallet = await Wallet.findOneAndUpdate(
                    { accountNumber },
                    { $inc: { balance: +amount, version: 1 } },
                    { new: true }
                ).session(session);

                if (!wallet) throw new Error('Wallet not found');

                await Transaction.create([{ type: 'credit', amount, walletId: wallet._id }], { session });
                await wallet.save({ session });

                await session.commitTransaction();
                return {walletBalance:wallet.balance, owner:wallet.name, accountNumber:wallet.accountNumber};

            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
        }, 5, 1000, 2, 5000);
    }

    async debitWallet(accountNumber: string, amount: number) {
        if (amount > PER_TRANSACTION_LIMIT) {
            throw new Error(`Transaction exceeds per-transaction limit of ${PER_TRANSACTION_LIMIT}`);
        }
    
        return retryWithTimeout(async () => {

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const wallet = await Wallet.findOneAndUpdate(
                    { accountNumber, balance: { $gte: amount } },
                    { $inc: { balance: -amount, version: 1 } },
                    { new: true }
                ).session(session);

                if (!wallet) throw new Error('Wallet not found');
                if (wallet.balance < amount) throw new Error('Insufficient balance');

                let walletId = wallet._id;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dailyTransactions = await Transaction.find({
                    walletId,
                    type: 'debit',
                    createdAt: { $gte: today }
                }).session(session);
                
                // Check daily limit
                const dailyTotal = dailyTransactions.reduce((sum, tx) => sum + tx.amount, 0);
                if (dailyTotal + amount > DAILY_LIMIT) {
                throw new Error(`Transaction exceeds daily limit of ${DAILY_LIMIT}`);
                }

                await Transaction.create([{ type: 'debit', amount, walletId: wallet._id }], { session });
                await wallet.save({ session });

                await session.commitTransaction();
                return {walletBalance:wallet.balance, owner:wallet.name, accountNumber:wallet.accountNumber};

            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
        }, 5, 1000, 2, 5000);
    }

    async getBalance(accountNumber: string) {
        return retryWithTimeout(async () => {

            const wallet = await Wallet.findOne({accountNumber});

            if (!wallet) throw new Error('Wallet not found');
            
            return {walletbalance: wallet.balance, owner: wallet.name, accountNumber: wallet.accountNumber};

        }, 3, 500, 2, 3000);
    }
  
}

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
                const wallet = await this.findAndUpdateWallet(accountNumber,+amount,session)

                await this.findAndUpdateTransaction(wallet.id, "credit", +amount, session)

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
                const updatedWallet = await this.findAndUpdateWallet(accountNumber,-amount,session)
                const initialWalletBalance = updatedWallet.balance+amount;
                if (initialWalletBalance < amount) throw new Error('Insufficient balance');
                
                await this.findAndUpdateTransaction(updatedWallet.id, "debit", amount, session)

                await updatedWallet.save({ session });
                await session.commitTransaction();

                return {walletBalance:updatedWallet.balance, owner:updatedWallet.name, accountNumber:updatedWallet.accountNumber};

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

    async findAndUpdateWallet(accountNumber: string, amount: number, session: mongoose.mongo.ClientSession){
        const wallet = await Wallet.findOneAndUpdate(
            { accountNumber },
            { $inc: { balance: amount, version: 1 } },
            { new: true }
        ).session(session);

        if (!wallet) throw new Error('Wallet not found');
        return wallet;
    } 
  
    async findAndUpdateTransaction(walletId: string, type: string, amount: number, session: mongoose.mongo.ClientSession){
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create the daily transaction record for the given date, walletId, and type
        const filter = { createdAt: { $gte: today }, walletId, type };
        const update = { $inc: { amount: +amount } };
        const options = { upsert: true, new: true };

        const dailyTransactions = await Transaction.findOneAndUpdate(filter, update, options).session(session);

        // Check daily limit
        if (dailyTransactions && type === "debit" && dailyTransactions.amount > DAILY_LIMIT)
        {
            throw new Error(`Transaction exceeds daily limit of ${DAILY_LIMIT}`);
        }
        await dailyTransactions?.save({ session });
    }
}

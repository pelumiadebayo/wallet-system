import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';
import { UserPayload } from '../types/userPayload';

const walletService = new WalletService();

export const createWallet = 
  async (req: Request, res: Response) => {
    const user = (req as any).user as UserPayload;
    if (user) {
        const wallet = await walletService.createWallet(user?.id, user?.name);
        res.status(201).json(wallet);
    }else{
      res.status(401).json({ error: 'User not authenticated' });
    }
  }

export const creditWallet = 
  async (req: Request, res: Response) => {
    const { accountNumber, amount } = req.body;
    const wallet = await walletService.creditWallet(accountNumber, amount);
    res.status(200).json(wallet);
  }

export const debitWallet = 
  async (req: Request, res: Response) => {
    const { accountNumber, amount } = req.body;
    const wallet = await walletService.debitWallet(accountNumber, amount);
    res.status(200).json(wallet);
  }

export const getBalance = 
  async (req: Request, res: Response) => {
    const { acctnumber } = req.params;
    const acctbalance = await walletService.getBalance(acctnumber);
    res.status(200).json(acctbalance);
  }


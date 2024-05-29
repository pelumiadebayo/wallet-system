import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';
import { UserPayload } from '../types/userPayload';

const walletService = new WalletService();

  export const createWallet = 
    async (req: Request, res: Response) => {
      const user = (req as any).user as UserPayload;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      try {

        //you might want to check if user exit
        const wallet = await walletService.createWallet(user?.id, user?.name);
        res.status(201).json(wallet);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });      }
    };
  

  export const creditWallet = 
    async (req: Request, res: Response) => {
      try {
        const { accountNumber, amount } = req.body;
        const wallet = await walletService.creditWallet(accountNumber, amount);
        res.status(200).json(wallet);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });      }
    }
  
  
  export const debitWallet = 
    async (req: Request, res: Response) => {
      try {
        const { accountNumber, amount } = req.body;
        const wallet = await walletService.debitWallet(accountNumber, amount);
        res.status(200).json(wallet);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });      }
    }
  
  

  export const getBalance= async(req: Request, res: Response) =>{
    try {
      const { acctnumber } = req.params;
      const acctbalance = await walletService.getBalance(acctnumber);
      res.status(200).json(acctbalance);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });    }
  }


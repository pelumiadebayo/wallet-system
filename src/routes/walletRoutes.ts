import { Router , Request, Response } from 'express';
import { createWallet, creditWallet, debitWallet, getBalance  } from '../controllers/walletController';
import {validateRegistration, validateLogin, validateTransaction } from '../validators/walletValidators';
import { handleValidationErrors } from '../validators/errorHandler';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Auth routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Wallet routes
router.post('/wallet', authMiddleware, handleValidationErrors, createWallet);
router.post('/wallet/credit', authMiddleware, validateTransaction, handleValidationErrors, creditWallet);
router.post('/wallet/debit', authMiddleware, validateTransaction, handleValidationErrors, debitWallet);
router.get('/balance/:acctnumber', authMiddleware, getBalance);

export default router;

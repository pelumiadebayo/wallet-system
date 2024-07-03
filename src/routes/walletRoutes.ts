import { Router, application } from 'express';
import { createWallet, creditWallet, debitWallet, getBalance  } from '../controllers/walletController';
import {validateRegistration, validateLogin, validateTransaction } from '../validators/walletValidators';
import { handleValidationErrors } from '../validators/errorHandler';
import { exceptionHandlerMiddleware } from '../middlewares/exceptionHandlerMiddleware';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';


const router = Router();

// Auth routes
router.get('/', (req, res) => {
  res.send('Welcome to my Wallet system!');
});
router.post('/register', validateRegistration, handleValidationErrors, exceptionHandlerMiddleware(register));
router.post('/login', validateLogin, handleValidationErrors, exceptionHandlerMiddleware(login));

// Wallet routes
router.post('/wallet', authMiddleware, handleValidationErrors, exceptionHandlerMiddleware(createWallet));
router.post('/wallet/credit', authMiddleware, validateTransaction, handleValidationErrors, exceptionHandlerMiddleware(creditWallet));
router.post('/wallet/debit', authMiddleware, validateTransaction, handleValidationErrors, exceptionHandlerMiddleware(debitWallet));
router.get('/balance/:acctnumber', authMiddleware, exceptionHandlerMiddleware(getBalance));

export default router;

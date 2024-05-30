import { body } from 'express-validator';

export const validateRegistration = [
  body('password')
    //.isStrongPassword()
    .isString()
    .withMessage('password must be a string')
    .notEmpty()
    .withMessage('password is required'),
  body('name')
    .isString()
    .withMessage('name must be a string')
    .notEmpty()
    .withMessage('name is required'),
  body('email')
    .isEmail()
    .withMessage('email is not valid')
    .notEmpty()
    .withMessage('email is required'),
];

export const validateLogin = [
  body('password')
    .isString()
    .withMessage('password must be a string')
    .notEmpty()
    .withMessage('password is required'),
  body('email')
    .isEmail()
    .withMessage('email is not valid')
    .notEmpty()
    .withMessage('email is required'),
];

export const validateTransaction = [
  body('accountNumber')
    .isString()
    .withMessage('accountNumber must be a string')
    .notEmpty()
    .withMessage('accountNumber is required')
    .isLength({ max: 10, min: 10 })
    .withMessage('Account number is invalid'),
  body('amount')
    .notEmpty()
    .withMessage('amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0')
];

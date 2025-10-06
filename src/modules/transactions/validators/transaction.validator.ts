import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ResponseHandler } from '../../../utils/response/responseHandler';

export const validateCreateTransaction = [
  body('transactionType')
    .trim()
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['online', 'offline']),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('additionalNote').optional(),
  body('cart').isArray({ min: 1 }).withMessage('Cart must be a non-empty array'),
  body('cart.*.itemName')
    .notEmpty()
    .withMessage('itemName is required')
    .isString()
    .withMessage('itemName must be a string'),
  body('cart.*.quantity')
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ gt: 0 })
    .withMessage('quantity must be a positive integer'),
  body('cart.*.price')
    .notEmpty()
    .withMessage('price is required')
    .isFloat({ gt: 0 })
    .withMessage('price must be a positive number'),
  body('cart.*.subTotal')
    .notEmpty()
    .withMessage('subTotal is required')
    .isFloat({ gt: 0 })
    .withMessage('subTotal must be a positive number'),
  body('voucher').optional(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        error: {
          code: 'VALIDATION_FAILED',
          details: errors.array(),
        },
      });
    }
    next();
  },
];

export const validateUpdateTransactionStatus = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['preparation', 'ready', 'served', 'completed']),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        error: {
          code: 'VALIDATION_FAILED',
          details: errors.array(),
        },
      });
    }
    next();
  },
];

export const validateUpdateTransactionTable = [
  body('tableNumber')
    .trim()
    .notEmpty()
    .withMessage('Table number is required for dine-in')
    .isNumeric()
    .withMessage('Table number must be numeric'),
  body('note').optional(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        error: {
          code: 'VALIDATION_FAILED',
          details: errors.array(),
        },
      });
    }
    next();
  },
];

export const validateCheckTransactionStatus = [
  body('orderIds.*').trim().notEmpty().withMessage('Order id is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        error: {
          code: 'VALIDATION_FAILED',
          details: errors.array(),
        },
      });
    }
    next();
  },
];

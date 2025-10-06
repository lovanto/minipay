import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import { CreateTransactionDTO } from '../models/transaction';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import {
  generateOrderNumber,
  generatePaymentNumber,
} from '../../../utils/generator/generate.number';

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    const transactionData: CreateTransactionDTO = req.body;

    try {
      let voucherData;
      if (transactionData.voucher) {
        voucherData = await prisma.voucher.findFirst({
          where: {
            name: transactionData.voucher,
          },
        });
        if (voucherData) {
          if (voucherData.type === 'percent' && Number(voucherData.discount) === 100) {
            const logVoucher = await prisma.logVoucher.findFirst({
              where: {
                voucherId: voucherData.id,
              },
              orderBy: {
                createdAt: 'desc',
              },
            });
            if (logVoucher) {
              return ResponseHandler.error(res, {
                message: 'This employee voucher has been used for today.',
                statusCode: 400,
              });
            }
          }
          if (Number(voucherData.amount) + 1 > Number(voucherData.maxAmount)) {
            return ResponseHandler.error(res, {
              message: 'This voucher has reached its usage limit.',
              statusCode: 400,
            });
          }
          if (voucherData?.expiredAt < new Date()) {
            return ResponseHandler.error(res, {
              message: 'This voucher has expired. Please try another one.',
              statusCode: 400,
            });
          }
        }
        if (!voucherData) {
          return ResponseHandler.error(res, {
            message: 'Invalid voucher code. Please check and try again.',
            statusCode: 404,
          });
        }
      }

      const orderNumber = await generateOrderNumber();
      const paymentNumber = await generatePaymentNumber();
      const subTotal = transactionData.cart.reduce((total, item) => total + item.subTotal, 0);

      let discountAmount = 0;
      if (voucherData) {
        if (voucherData.type === 'percent') {
          discountAmount = (subTotal * Number(voucherData.discount)) / 100;
        } else {
          discountAmount = Number(voucherData.discount);
        }
      }

      let serviceCharge = 0;
      if (voucherData?.type === 'percent' && Number(voucherData?.discount) === 100) {
        serviceCharge = 0;
      } else {
        if (transactionData.paymentMethod === 'qris') {
          serviceCharge = Math.ceil((subTotal - discountAmount) * 0.007 + 500);
        } else if (transactionData.paymentMethod === 'gopay') {
          serviceCharge = Math.ceil((subTotal - discountAmount) * 0.02 + 500);
        } else {
          serviceCharge = 500;
        }
      }

      const totalBeforeRounding = subTotal - discountAmount + serviceCharge;
      let rounding = 0;
      const remainder = totalBeforeRounding % 1000;
      if (remainder === 0) {
        rounding = 0;
      } else if (remainder <= 500) {
        rounding = 500 - remainder;
      } else {
        rounding = 1000 - remainder;
      }
      const total = totalBeforeRounding + rounding;

      let transactionStatus = 'pending';
      if (voucherData && total === 0) {
        transactionStatus = 'completed';
      } else if (transactionData.paymentMethod !== 'cash') {
        transactionStatus = transactionData.status;
      } else if (transactionData.paymentMethod === 'cash') {
        transactionStatus = 'completed';
      }

      const transaction = await prisma.transaction.create({
        data: {
          number: orderNumber,
          transactionType: transactionData.transactionType,
          paymentNumber: paymentNumber,
          paymentMethod: transactionData.paymentMethod,
          customerName: transactionData.customerName,
          serviceCharge: serviceCharge,
          rounding: rounding,
          discount: discountAmount,
          total: total,
          voucherId: voucherData?.id,
          status: transactionStatus,
        },
      });

      if (voucherData) {
        await prisma.voucher.update({
          where: { id: voucherData.id },
          data: {
            amount: Number(voucherData.amount) + 1,
          },
        });
        await prisma.logVoucher.create({
          data: {
            transactionId: transaction.id,
            voucherId: voucherData.id,
          },
        });
      }

      return ResponseHandler.success(res, {
        message: 'Transaction created successfully',
        data: {
          ...transaction,
        },
      });
    } catch (error) {
      logger.error('Error creating transaction:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}

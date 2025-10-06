import { Request, Response } from 'express';
import { logger } from '../../../utils/common/logger';
import { CreateVoucherDTO } from '../models/voucher';
import { ResponseHandler } from '../../../utils/response/responseHandler';
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export class VoucherController {
  async getAllVouchers(req: Request, res: Response) {
    const { search } = req.query as { search: string };

    const searchStr: string | undefined = typeof search === 'string' ? search : undefined;

    try {
      const whereClause: Prisma.VoucherWhereInput = {};

      if (searchStr) {
        whereClause.name = {
          contains: searchStr,
          mode: 'insensitive',
        };
      }

      const vouchers = await prisma.voucher.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'asc',
        },
      });
      return ResponseHandler.success(res, {
        message: 'Vouchers retrieved successfully',
        data: vouchers,
      });
    } catch (error) {
      logger.error('Error getting vouchers:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async getTodayUsedVouchers(req: Request, res: Response) {
    try {
      const total = await prisma.voucher.count({
        where: {},
      });
      const used = await prisma.logVoucher.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });
      return ResponseHandler.success(res, {
        message: 'Vouchers retrieved successfully',
        data: { total, used },
      });
    } catch (error) {
      logger.error('Error getting vouchers:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async getVoucherByName(req: Request, res: Response) {
    const { code } = req.params;

    try {
      const voucher = await prisma.voucher.findFirst({
        where: { name: code },
      });
      if (!voucher) {
        return ResponseHandler.error(res, {
          message: 'Voucher not found',
          statusCode: 404,
        });
      }

      return ResponseHandler.success(res, {
        message: 'Voucher retrieved successfully',
        data: voucher,
      });
    } catch (error) {
      logger.error('Error getting voucher:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async createVoucher(req: Request, res: Response) {
    const voucherData: CreateVoucherDTO = req.body;

    try {
      const findVoucher = await prisma.voucher.findFirst({
        where: { name: voucherData.name },
      });
      if (findVoucher) {
        return ResponseHandler.error(res, {
          message: 'Voucher already exists',
          statusCode: 400,
        });
      }

      const voucher = await prisma.voucher.create({
        data: {
          name: voucherData.name,
          type: voucherData.type,
          discount: Number(voucherData.discount),
          amount: 0,
          maxAmount: Number(voucherData.maxAmount),
          expiredAt: new Date(voucherData.expiredAt),
        },
      });

      return ResponseHandler.success(res, {
        message: 'Voucher created successfully',
        data: voucher,
      });
    } catch (error) {
      logger.error('Error creating voucher:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async updateVoucher(req: Request, res: Response) {
    const { id } = req.params;
    const voucherData: CreateVoucherDTO = req.body;

    try {
      const findVoucher = await prisma.voucher.findUnique({
        where: { id },
      });
      if (!findVoucher) {
        return ResponseHandler.error(res, {
          message: 'Voucher not found',
          statusCode: 404,
        });
      }

      const voucher = await prisma.voucher.update({
        where: { id },
        data: {
          name: voucherData.name,
          type: voucherData.type,
          discount: Number(voucherData.discount),
          maxAmount: Number(voucherData.maxAmount),
          expiredAt: new Date(voucherData.expiredAt),
        },
      });

      return ResponseHandler.success(res, {
        message: 'Voucher updated successfully',
        data: voucher,
      });
    } catch (error) {
      logger.error('Error updating voucher:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }

  async deleteVoucher(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const findVoucher = await prisma.voucher.findUnique({
        where: { id },
      });
      if (!findVoucher) {
        return ResponseHandler.error(res, {
          message: 'Voucher not found',
          statusCode: 404,
        });
      }

      const voucher = await prisma.voucher.delete({
        where: { id },
      });

      return ResponseHandler.success(res, {
        message: 'Voucher deleted successfully',
        data: voucher,
      });
    } catch (error) {
      logger.error('Error deleting voucher:', error);
      return ResponseHandler.error(res, {
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}

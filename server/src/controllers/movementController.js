import { prisma } from '../utils/prisma.js';
import { successResponse } from '../utils/response.js';

export const getMovements = async (req, res, next) => {
  try {
    const { productId, type, page = 1, limit = 20 } = req.query;
    const where = {};

    if (productId) where.productId = productId;
    if (type && type !== 'ALL') where.type = type.toUpperCase();

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const take = Math.max(1, parseInt(limit, 10));

    const [total, movements] = await Promise.all([
      prisma.inventoryMovement.count({ where }),
      prisma.inventoryMovement.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, sku: true, imageUrl: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return successResponse(res, 'Movements retrieved successfully.', movements, 200, {
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    });
  } catch (err) {
    next(err);
  }
};

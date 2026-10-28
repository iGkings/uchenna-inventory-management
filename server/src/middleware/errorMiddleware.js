import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, err.stack);

  // Prisma unique constraint error code P2002
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return errorResponse(res, `A record with this ${fields} already exists.`, 409);
  }

  // Prisma foreign key constraint error P2003
  if (err.code === 'P2003') {
    return errorResponse(res, 'Foreign key constraint violated.', 400);
  }

  // Prisma record not found P2025
  if (err.code === 'P2025') {
    return errorResponse(res, 'Requested resource not found.', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';

  return errorResponse(res, message, statusCode);
};

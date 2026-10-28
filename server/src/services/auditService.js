import { prisma } from '../utils/prisma.js';
import logger from '../utils/logger.js';

export const logAudit = async ({ userId = null, action, entity, entityId = null, details = null, ipAddress = null }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
      },
    });
  } catch (err) {
    logger.error('Failed to write audit log entry:', err.message);
  }
};

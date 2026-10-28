import { getDashboardStats } from '../services/dashboardService.js';
import { successResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    return successResponse(res, 'Dashboard analytics retrieved successfully.', stats);
  } catch (err) {
    next(err);
  }
};

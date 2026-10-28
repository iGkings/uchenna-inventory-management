import { loginUser, logoutUser } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const { user, token } = await loginUser({ email, password, ipAddress });

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 'Login successful. Welcome back!', { user, token });
  } catch (err) {
    return errorResponse(res, err.message || 'Login failed.', 401);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    await logoutUser({ userId, ipAddress });

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return successResponse(res, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res) => {
  return successResponse(res, 'Current user profile retrieved.', req.user);
};

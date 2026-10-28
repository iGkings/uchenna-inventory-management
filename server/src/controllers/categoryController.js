import * as categoryService from '../services/categoryService.js';
import { successResponse } from '../utils/response.js';

export const getCategories = async (req, res, next) => {
  try {
    const { search } = req.query;
    const categories = await categoryService.listCategories({ search });
    return successResponse(res, 'Categories retrieved successfully.', categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, 'Category retrieved successfully.', category);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const category = await categoryService.createCategory(req.body, userId, ipAddress);
    return successResponse(res, 'Category created successfully.', category, 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const category = await categoryService.updateCategory(req.params.id, req.body, userId, ipAddress);
    return successResponse(res, 'Category updated successfully.', category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await categoryService.deleteCategory(req.params.id, userId, ipAddress);
    return successResponse(res, 'Category deleted successfully.', result);
  } catch (err) {
    next(err);
  }
};

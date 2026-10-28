import * as productService from '../services/productService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId, status, sortBy, sortOrder, page, limit } = req.query;
    const result = await productService.listProducts({
      search,
      categoryId,
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    });
    return successResponse(res, 'Products retrieved successfully.', result.products, 200, result.pagination);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 'Product retrieved successfully.', product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const product = await productService.createProduct(req.body, userId, ipAddress);
    return successResponse(res, 'Product created successfully.', product, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const product = await productService.updateProduct(req.params.id, req.body, userId, ipAddress);
    return successResponse(res, 'Product updated successfully.', product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await productService.deleteProduct(req.params.id, userId, ipAddress);
    return successResponse(res, 'Product deleted successfully.', result);
  } catch (err) {
    next(err);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const { type, quantity, reason, referenceNote } = req.body;

    const result = await productService.adjustStock({
      productId: req.params.id,
      type,
      quantity,
      reason,
      referenceNote,
      userId,
      ipAddress,
    });

    return successResponse(res, 'Stock adjustment completed successfully.', result);
  } catch (err) {
    next(err);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const csvData = await productService.exportProductsCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=igkings-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    return res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};

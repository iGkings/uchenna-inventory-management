import { errorResponse } from '../utils/response.js';

export const validateProductInput = (req, res, next) => {
  const { name, sku, categoryId, unitPrice, quantity, reorderLevel } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Product name is required.';
  }

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    errors.sku = 'SKU is required.';
  } else if (!/^[A-Za-z0-9-_]+$/.test(sku.trim())) {
    errors.sku = 'SKU may only contain letters, numbers, hyphens, and underscores.';
  }

  if (!categoryId || typeof categoryId !== 'string') {
    errors.categoryId = 'A valid category is required.';
  }

  const parsedPrice = parseFloat(unitPrice);
  if (unitPrice === undefined || isNaN(parsedPrice) || parsedPrice < 0) {
    errors.unitPrice = 'Unit price must be a valid non-negative number.';
  }

  if (quantity !== undefined) {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 0 || parsedQty !== Number(quantity)) {
      errors.quantity = 'Quantity must be a non-negative whole number.';
    }
  }

  if (reorderLevel !== undefined) {
    const parsedReorder = parseInt(reorderLevel, 10);
    if (isNaN(parsedReorder) || parsedReorder < 0 || parsedReorder !== Number(reorderLevel)) {
      errors.reorderLevel = 'Reorder level must be a non-negative whole number.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed for product.', 422, errors);
  }

  req.body.name = name.trim();
  req.body.sku = sku.trim().toUpperCase();
  req.body.unitPrice = parsedPrice;
  req.body.quantity = quantity !== undefined ? parseInt(quantity, 10) : 0;
  req.body.reorderLevel = reorderLevel !== undefined ? parseInt(reorderLevel, 10) : 10;
  next();
};

export const validateStockAdjustment = (req, res, next) => {
  const { type, quantity, reason, referenceNote } = req.body;
  const errors = {};

  const validTypes = ['IN', 'OUT', 'ADJUSTMENT'];
  if (!type || !validTypes.includes(type.toUpperCase())) {
    errors.type = 'Adjustment type must be IN, OUT, or ADJUSTMENT.';
  }

  const parsedQty = parseInt(quantity, 10);
  if (quantity === undefined || isNaN(parsedQty) || parsedQty <= 0) {
    errors.quantity = 'Adjustment quantity must be a positive whole number greater than 0.';
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    errors.reason = 'A reason for stock adjustment is required.';
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed for stock adjustment.', 422, errors);
  }

  req.body.type = type.toUpperCase();
  req.body.quantity = parsedQty;
  req.body.reason = reason.trim();
  req.body.referenceNote = referenceNote ? referenceNote.trim() : null;
  next();
};

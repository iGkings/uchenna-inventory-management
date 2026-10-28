import { errorResponse } from '../utils/response.js';

export const validateCategoryInput = (req, res, next) => {
  const { name, description } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Category name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed for category.', 422, errors);
  }

  req.body.name = name.trim();
  req.body.description = description ? description.trim() : null;
  next();
};

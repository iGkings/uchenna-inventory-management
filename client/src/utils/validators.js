/**
 * Form Validation Rules
 */

export const validateProduct = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Product name is required.';
  }

  if (!values.sku || !values.sku.trim()) {
    errors.sku = 'SKU is required.';
  } else if (!/^[A-Za-z0-9-_]+$/.test(values.sku.trim())) {
    errors.sku = 'SKU may only contain letters, numbers, hyphens, and underscores.';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Please select a category.';
  }

  const price = parseFloat(values.unitPrice);
  if (values.unitPrice === '' || isNaN(price) || price < 0) {
    errors.unitPrice = 'Price must be a positive number.';
  }

  const qty = parseInt(values.quantity, 10);
  if (values.quantity === '' || isNaN(qty) || qty < 0 || qty !== Number(values.quantity)) {
    errors.quantity = 'Quantity must be a positive whole number.';
  }

  const reorder = parseInt(values.reorderLevel, 10);
  if (values.reorderLevel === '' || isNaN(reorder) || reorder < 0 || reorder !== Number(values.reorderLevel)) {
    errors.reorderLevel = 'Reorder level must be a positive whole number.';
  }

  return errors;
};

export const validateCategory = (values) => {
  const errors = {};
  if (!values.name || !values.name.trim()) {
    errors.name = 'Category name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  return errors;
};

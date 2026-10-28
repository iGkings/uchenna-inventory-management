import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import FormField from '../../components/FormField/FormField';
import { validateProduct } from '../../utils/validators';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import useToast from '../../hooks/useToast';
import './ProductModal.css';

export const ProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  product = null, // null for create, object for edit
}) => {
  const isEdit = !!product;
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    unitPrice: '',
    quantity: '0',
    reorderLevel: '10',
    description: '',
    imageUrl: '',
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories().then((data) => {
        setCategories(data || []);
      }).catch(() => {});

      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          categoryId: product.categoryId || '',
          unitPrice: product.unitPrice?.toString() || '',
          quantity: product.quantity?.toString() || '0',
          reorderLevel: product.reorderLevel?.toString() || '10',
          description: product.description || '',
          imageUrl: product.imageUrl || '',
        });
      } else {
        setFormData({
          name: '',
          sku: '',
          categoryId: '',
          unitPrice: '',
          quantity: '0',
          reorderLevel: '10',
          description: '',
          imageUrl: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        categoryId: formData.categoryId,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity, 10),
        reorderLevel: parseInt(formData.reorderLevel, 10),
        description: formData.description,
        imageUrl: formData.imageUrl || null,
      };

      if (isEdit) {
        await productService.updateProduct(product.id, payload);
        toast.success(`Product "${payload.name}" updated successfully.`);
      } else {
        await productService.createProduct(payload);
        toast.success(`Product "${payload.name}" created successfully.`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save product.');
      if (err.errors) {
        setErrors(err.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      subtitle={isEdit ? `Update specifications for SKU: ${product?.sku}` : 'Enter product information and initial inventory count.'}
      size="lg"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="product-form-grid">
          <FormField
            label="Product Name"
            name="name"
            required
            error={errors.name}
            className="product-form-full"
          >
            <input
              type="text"
              name="name"
              className="input"
              placeholder="e.g. Minimal Watch"
              value={formData.name}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="SKU" name="sku" required error={errors.sku}>
            <input
              type="text"
              name="sku"
              className="input"
              placeholder="e.g. SWR-002"
              value={formData.sku}
              onChange={handleChange}
              disabled={isEdit}
            />
          </FormField>

          <FormField label="Category" name="categoryId" required error={errors.categoryId}>
            <select
              name="categoryId"
              className="select"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Unit Price ($)" name="unitPrice" required error={errors.unitPrice}>
            <input
              type="number"
              name="unitPrice"
              step="0.01"
              min="0"
              className="input"
              placeholder="0.00"
              value={formData.unitPrice}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Initial Quantity"
            name="quantity"
            required
            error={errors.quantity}
            hint={isEdit ? 'To adjust stock balance, use the Adjust Stock feature.' : undefined}
          >
            <input
              type="number"
              name="quantity"
              step="1"
              min="0"
              className="input"
              placeholder="0"
              value={formData.quantity}
              onChange={handleChange}
              disabled={isEdit}
            />
          </FormField>

          <FormField label="Reorder Threshold" name="reorderLevel" required error={errors.reorderLevel}>
            <input
              type="number"
              name="reorderLevel"
              step="1"
              min="0"
              className="input"
              placeholder="10"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Image URL (Optional)" name="imageUrl" error={errors.imageUrl}>
            <input
              type="url"
              name="imageUrl"
              className="input"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Product Description"
            name="description"
            error={errors.description}
            className="product-form-full"
          >
            <textarea
              name="description"
              rows={3}
              className="textarea"
              placeholder="Provide a clear description of specifications and materials..."
              value={formData.description}
              onChange={handleChange}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;

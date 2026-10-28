import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import FormField from '../../components/FormField/FormField';
import { validateCategory } from '../../utils/validators';
import categoryService from '../../services/categoryService';
import useToast from '../../hooks/useToast';

export const CategoryModal = ({
  isOpen,
  onClose,
  category = null,
  onSuccess,
}) => {
  const isEdit = !!category;
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || '',
          description: category.description || '',
        });
      } else {
        setFormData({ name: '', description: '' });
      }
      setErrors({});
    }
  }, [isOpen, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCategory(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await categoryService.updateCategory(category.id, formData);
        toast.success(`Category "${formData.name}" updated successfully.`);
      } else {
        await categoryService.createCategory(formData);
        toast.success(`Category "${formData.name}" created successfully.`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save category.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Create New Category'}
      subtitle="Organize your inventory catalog with distinct classification zones."
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
            {submitting ? 'Saving...' : isEdit ? 'Update Category' : 'Save Category'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Category Name" name="name" required error={errors.name}>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="e.g. Smart Wearables"
            value={formData.name}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Description (Optional)" name="description" error={errors.description}>
          <textarea
            name="description"
            rows={3}
            className="textarea"
            placeholder="Briefly describe the types of products belonging to this category..."
            value={formData.description}
            onChange={handleChange}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default CategoryModal;

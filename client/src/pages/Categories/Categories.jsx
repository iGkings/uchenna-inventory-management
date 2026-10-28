import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  FolderKanban,
  Boxes,
} from 'lucide-react';
import SearchBar from '../../components/SearchBar/SearchBar';
import DataTable from '../../components/DataTable/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import CategoryModal from '../../features/categories/CategoryModal';
import CategoryDetailModal from '../../features/categories/CategoryDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import categoryService from '../../services/categoryService';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import './Categories.css';

export const Categories = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [detailCategoryId, setDetailCategoryId] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories(debouncedSearch);
      setCategories(data || []);
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      toast.success(`Category "${deletingCategory.name}" removed successfully.`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Cannot delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (_, row) => (
        <div className="category-name-cell">
          <span className="category-main-name">{row.name}</span>
          <span className="category-slug">/{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (desc) => (
        <span style={{ color: '#64748B', fontSize: '13px' }}>
          {desc || '—'}
        </span>
      ),
    },
    {
      key: 'productCount',
      label: 'Associated Products',
      render: (count, row) => (
        <button
          type="button"
          className="product-count-badge"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products?categoryId=${row.id}`);
          }}
          title="View products in this category"
        >
          <Boxes size={13} />
          <span>{count} products</span>
        </button>
      ),
    },
    {
      key: 'totalInventoryValue',
      label: 'Inventory Value',
      render: (val) => (
        <strong style={{ color: '#06274B' }}>{formatCurrency(val)}</strong>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (date) => formatDate(date),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="table-actions-cell" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="action-icon-btn"
            title="View Details"
            onClick={() => setDetailCategoryId(row.id)}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn"
            title="Edit Category"
            onClick={() => setEditingCategory(row)}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn btn-delete"
            title="Delete Category"
            onClick={() => setDeletingCategory(row)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="categories-page-root">
      <div className="categories-page-header">
        <div className="page-title-group">
          <h2 className="page-main-title">Category Management</h2>
          <p className="page-subtitle">
            Classify and segment your enterprise inventory into structured departments.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      <div className="categories-filter-bar">
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="Search category name or description..."
            showShortcut={true}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        onRowClick={(row) => setDetailCategoryId(row.id)}
        emptyTitle="No categories found"
        emptyDescription="Create your first inventory category to start organizing products."
      />

      <CategoryModal
        isOpen={isAddModalOpen || !!editingCategory}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={fetchCategories}
      />

      {detailCategoryId && (
        <CategoryDetailModal
          isOpen={!!detailCategoryId}
          onClose={() => setDetailCategoryId(null)}
          categoryId={detailCategoryId}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={
          deletingCategory?.productCount > 0
            ? `Category "${deletingCategory?.name}" has ${deletingCategory?.productCount} product(s) assigned. You must reassign or remove these products before deleting this category.`
            : `Are you sure you want to delete category "${deletingCategory?.name}"?`
        }
        confirmText="Delete Category"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default Categories;

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  Boxes,
  PackageOpen,
} from 'lucide-react';
import SearchBar from '../../components/SearchBar/SearchBar';
import DataTable from '../../components/DataTable/DataTable';
import Pagination from '../../components/Pagination/Pagination';
import StockStatusBadge from '../../components/StockStatusBadge/StockStatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import ProductModal from '../../features/products/ProductModal';
import StockAdjustModal from '../../features/products/StockAdjustModal';
import ProductDetailModal from '../../features/products/ProductDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadFile } from '../../utils/exportCsv';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import './Products.css';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('categoryId') || 'ALL';
  const initialStatus = searchParams.get('status') || 'ALL';

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [detailProductId, setDetailProductId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories for dropdown
  useEffect(() => {
    categoryService.getCategories().then((data) => {
      setCategories(data || []);
    }).catch(() => {});
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search: debouncedSearch,
        categoryId,
        status,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });
      setProducts(data.products || []);
      setPagination(data.meta || { total: 0, totalPages: 1, limit: 10 });
    } catch (err) {
      toast.error('Failed to load products list.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryId, status, sortBy, sortOrder, page, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingProduct.id);
      toast.success(`Product "${deletingProduct.name}" removed successfully.`);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Export CSV
  const handleExport = async () => {
    try {
      toast.info('Exporting product catalog...');
      const csvData = await productService.exportCsv();
      downloadFile(csvData, `igkings-products-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Product catalog exported successfully.');
    } catch (err) {
      toast.error('Failed to export catalog.');
    }
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'name',
      label: 'Product & SKU',
      sortable: true,
      render: (_, row) => (
        <div className="product-table-cell">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="product-row-img" />
          ) : (
            <div className="product-row-img-fallback">
              <Boxes size={18} />
            </div>
          )}
          <div className="product-text-details">
            <span className="product-primary-name">{row.name}</span>
            <span className="product-sku-code">{row.sku}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (_, row) => row.category?.name || 'Unassigned',
    },
    {
      key: 'unitPrice',
      label: 'Price',
      sortable: true,
      render: (price) => formatCurrency(price),
    },
    {
      key: 'quantity',
      label: 'Stock Quantity',
      sortable: true,
      render: (qty, row) => (
        <div>
          <strong style={{ fontSize: '14px' }}>{qty}</strong>
          <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '6px' }}>
            (Min: {row.reorderLevel})
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <StockStatusBadge quantity={row.quantity} reorderLevel={row.reorderLevel} />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
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
            title="View Details & Movement History"
            onClick={() => setDetailProductId(row.id)}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn btn-adjust"
            title="Adjust Stock Balance"
            onClick={() => setAdjustingProduct(row)}
          >
            <ArrowUpDown size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn"
            title="Edit Product"
            onClick={() => setEditingProduct(row)}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn btn-delete"
            title="Delete Product"
            onClick={() => setDeletingProduct(row)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="products-page-root">
      {/* Header with Title and Primary Actions */}
      <div className="products-page-header">
        <div className="page-title-group">
          <h2 className="page-main-title">Products Inventory</h2>
          <p className="page-subtitle">
            Manage your catalog items, track stock quantities, and record adjustments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
            title="Export products to CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="products-filter-bar">
        <div className="filter-left-group">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by product name, SKU, or description..."
            showShortcut={true}
          />
        </div>

        <div className="filter-right-group">
          <select
            className="filter-select"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(row) => setDetailProductId(row.id)}
        emptyTitle="No products match your criteria"
        emptyDescription="Try adjusting your search query, category filter, or status filter."
      />

      {/* Pagination Bar */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => setPage(p)}
      />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen || !!editingProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={fetchProducts}
      />

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <StockAdjustModal
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          product={adjustingProduct}
          onSuccess={fetchProducts}
        />
      )}

      {/* Product Detail Modal */}
      {detailProductId && (
        <ProductDetailModal
          isOpen={!!detailProductId}
          onClose={() => setDetailProductId(null)}
          productId={detailProductId}
          onEdit={(prod) => setEditingProduct(prod)}
          onAdjustStock={(prod) => setAdjustingProduct(prod)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}" (SKU: ${deletingProduct?.sku})? This action cannot be undone.`}
        confirmText="Delete Product"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default Products;

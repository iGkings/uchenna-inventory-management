import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ExternalLink } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import StockStatusBadge from '../../components/StockStatusBadge/StockStatusBadge';
import { formatCurrency } from '../../utils/formatters';
import categoryService from '../../services/categoryService';
import LoadingState from '../../components/LoadingState/LoadingState';

export const CategoryDetailModal = ({
  isOpen,
  onClose,
  categoryId,
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && categoryId) {
      setLoading(true);
      categoryService
        .getCategoryById(categoryId)
        .then((data) => setCategory(data))
        .catch(() => setCategory(null))
        .finally(() => setLoading(false));
    }
  }, [isOpen, categoryId]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Category Details"
      subtitle="Overview of category classification and assigned inventory products."
      size="lg"
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      }
    >
      {loading ? (
        <LoadingState message="Loading category products..." />
      ) : !category ? (
        <p>Category not found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#06274B' }}>{category.name}</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              {category.description || 'No description provided.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '13px' }}>
              <div><strong>Assigned Products:</strong> {category.productCount}</div>
              <div><strong>Category Inventory Value:</strong> {formatCurrency(category.totalInventoryValue)}</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Products in this Category</h4>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px' }}
                onClick={() => {
                  onClose();
                  navigate(`/products?categoryId=${category.id}`);
                }}
              >
                <span>Filter on Products Page</span>
                <ExternalLink size={13} />
              </button>
            </div>

            {(!category.products || category.products.length === 0) ? (
              <p style={{ fontSize: '13px', color: '#64748B' }}>No products currently assigned to this category.</p>
            ) : (
              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>SKU</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Product Name</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Price</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Stock</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{p.sku}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '8px 12px' }}>{formatCurrency(p.unitPrice)}</td>
                        <td style={{ padding: '8px 12px' }}>{p.quantity} units</td>
                        <td style={{ padding: '8px 12px' }}>
                          <StockStatusBadge quantity={p.quantity} reorderLevel={p.reorderLevel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CategoryDetailModal;

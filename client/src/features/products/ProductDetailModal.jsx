import React, { useState, useEffect } from 'react';
import { Package, ArrowUpDown } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import StockStatusBadge, { MovementBadge } from '../../components/StockStatusBadge/StockStatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import productService from '../../services/productService';
import LoadingState from '../../components/LoadingState/LoadingState';
import './ProductDetailModal.css';

export const ProductDetailModal = ({
  isOpen,
  onClose,
  productId,
  onEdit,
  onAdjustStock,
}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      productService
        .getProductById(productId)
        .then((data) => setProduct(data))
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details & Stock History"
      subtitle="Complete inventory specifications and recent movement audit trail."
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {product && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  if (onEdit) onEdit(product);
                }}
              >
                Edit Product
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  onClose();
                  if (onAdjustStock) onAdjustStock(product);
                }}
              >
                Adjust Stock
              </button>
            </>
          )}
        </>
      }
    >
      {loading ? (
        <LoadingState message="Fetching product specifications and movement history..." />
      ) : !product ? (
        <p>Product not found.</p>
      ) : (
        <div className="detail-modal-layout">
          <div className="detail-header-card">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="detail-img-box"
              />
            ) : (
              <div className="detail-img-placeholder">
                <Package size={32} />
              </div>
            )}
            <div className="detail-title-col">
              <h3 className="detail-pname">{product.name}</h3>
              <span className="detail-sku-badge">SKU: {product.sku}</span>
              <div>
                <StockStatusBadge
                  quantity={product.quantity}
                  reorderLevel={product.reorderLevel}
                />
              </div>
            </div>
          </div>

          <div className="detail-grid-metrics">
            <div className="metric-tile">
              <span className="metric-tile-lbl">Category</span>
              <span className="metric-tile-val" style={{ fontSize: '14px' }}>
                {product.category?.name || 'Unassigned'}
              </span>
            </div>
            <div className="metric-tile">
              <span className="metric-tile-lbl">Unit Price</span>
              <span className="metric-tile-val">{formatCurrency(product.unitPrice)}</span>
            </div>
            <div className="metric-tile">
              <span className="metric-tile-lbl">Stock Balance</span>
              <span className="metric-tile-val">{product.quantity} units</span>
            </div>
            <div className="metric-tile">
              <span className="metric-tile-lbl">Reorder Level</span>
              <span className="metric-tile-val">{product.reorderLevel} units</span>
            </div>
          </div>

          {product.description && (
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ fontSize: '12px', color: '#64748B' }}>Description:</strong>
              <p style={{ marginTop: '4px', fontSize: '13px', color: '#1E293B' }}>{product.description}</p>
            </div>
          )}

          <div>
            <h4 className="movements-section-title">Recent Stock Movement Activity</h4>
            {(!product.movements || product.movements.length === 0) ? (
              <p style={{ fontSize: '13px', color: '#64748B' }}>No movement history recorded yet for this item.</p>
            ) : (
              <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <table style={{ fontSize: '12px', width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Qty Change</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Balance</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Reason & Note</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.movements.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <MovementBadge type={m.type} />
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                          {m.type === 'OUT' ? `-${m.quantity}` : `+${m.quantity}`}
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          {m.previousQuantity} → {m.newQuantity}
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <div>{m.reason}</div>
                          {m.referenceNote && (
                            <div style={{ color: '#94A3B8', fontSize: '11px' }}>{m.referenceNote}</div>
                          )}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#64748B' }}>
                          {formatDateTime(m.createdAt)}
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          {m.user?.name || 'Uchenna'}
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

export default ProductDetailModal;

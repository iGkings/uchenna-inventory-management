import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import FormField from '../../components/FormField/FormField';
import productService from '../../services/productService';
import useToast from '../../hooks/useToast';
import './StockAdjustModal.css';

export const StockAdjustModal = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const toast = useToast();
  const [type, setType] = useState('IN'); // IN, OUT, ADJUSTMENT
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Purchase Restock');
  const [referenceNote, setReferenceNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setType('IN');
      setQuantity('');
      setReason('Purchase Restock');
      setReferenceNote('');
      setError(null);
    }
  }, [isOpen]);

  if (!product) return null;

  const currentQty = product.quantity || 0;
  const parsedQty = parseInt(quantity, 10) || 0;

  let projectedQty = currentQty;
  if (type === 'IN') projectedQty = currentQty + parsedQty;
  else if (type === 'OUT') projectedQty = currentQty - parsedQty;
  else if (type === 'ADJUSTMENT') projectedQty = parsedQty;

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    if (selectedType === 'IN') setReason('Purchase Restock');
    else if (selectedType === 'OUT') setReason('Sales Dispatch');
    else if (selectedType === 'ADJUSTMENT') setReason('Physical Count Reconciliation');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parsedQty || parsedQty <= 0) {
      setError('Please specify a positive quantity greater than 0.');
      return;
    }

    if (type === 'OUT' && parsedQty > currentQty) {
      setError(`Cannot dispatch ${parsedQty} units. Maximum available is ${currentQty}.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await productService.adjustStock(product.id, {
        type,
        quantity: parsedQty,
        reason,
        referenceNote,
      });

      toast.success(
        `Stock updated for ${product.name}. New balance: ${projectedQty} units.`
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to complete stock adjustment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory Stock"
      subtitle="Record stock intake, outgoing orders, or physical inventory reconciliations."
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
            className="btn btn-accent"
            onClick={handleSubmit}
            disabled={submitting || (type === 'OUT' && parsedQty > currentQty)}
          >
            {submitting ? 'Updating...' : 'Confirm Stock Adjustment'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="stock-adjust-summary">
          <div className="adjust-product-meta">
            <span className="adjust-product-name">{product.name}</span>
            <span className="adjust-product-sku">SKU: {product.sku}</span>
          </div>
          <div className="adjust-counts-preview">
            <div className="count-col">
              <span className="count-label">Current</span>
              <span className="count-val current">{currentQty}</span>
            </div>
            <ArrowRight size={16} color="#94A3B8" />
            <div className="count-col">
              <span className="count-label">Projected</span>
              <span className={`count-val ${projectedQty < 0 ? 'projected-danger' : 'projected'}`}>
                {projectedQty}
              </span>
            </div>
          </div>
        </div>

        <div className="type-selector-pills">
          <button
            type="button"
            className={`type-pill ${type === 'IN' ? 'active-in' : ''}`}
            onClick={() => handleTypeSelect('IN')}
          >
            Stock In (+)
          </button>
          <button
            type="button"
            className={`type-pill ${type === 'OUT' ? 'active-out' : ''}`}
            onClick={() => handleTypeSelect('OUT')}
          >
            Stock Out (-)
          </button>
          <button
            type="button"
            className={`type-pill ${type === 'ADJUSTMENT' ? 'active-adj' : ''}`}
            onClick={() => handleTypeSelect('ADJUSTMENT')}
          >
            Reconcile
          </button>
        </div>

        <FormField
          label={type === 'ADJUSTMENT' ? 'Actual Count' : 'Quantity to Move'}
          required
          error={error}
        >
          <input
            type="number"
            min="1"
            className="input"
            placeholder="Enter quantity..."
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError(null);
            }}
          />
        </FormField>

        <FormField label="Reason for Movement" required>
          <select
            className="select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {type === 'IN' && (
              <>
                <option value="Purchase Restock">Purchase Restock</option>
                <option value="Supplier Delivery">Supplier Delivery</option>
                <option value="Customer Return">Customer Return</option>
                <option value="Warehouse Transfer In">Warehouse Transfer In</option>
              </>
            )}
            {type === 'OUT' && (
              <>
                <option value="Sales Dispatch">Sales Dispatch</option>
                <option value="Damaged / Broken">Damaged / Broken</option>
                <option value="Supplier Return">Supplier Return</option>
                <option value="Internal Use">Internal Use</option>
              </>
            )}
            {type === 'ADJUSTMENT' && (
              <>
                <option value="Physical Count Reconciliation">Physical Count Reconciliation</option>
                <option value="Audit Adjustment">Audit Adjustment</option>
                <option value="Initial Calibration">Initial Calibration</option>
              </>
            )}
          </select>
        </FormField>

        <FormField label="Reference Note / PO / Batch # (Optional)">
          <input
            type="text"
            className="input"
            placeholder="e.g. PO #8491, Container Zone B"
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default StockAdjustModal;

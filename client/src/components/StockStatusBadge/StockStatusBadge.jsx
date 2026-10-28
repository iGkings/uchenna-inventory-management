import React from 'react';
import './StockStatusBadge.css';

export const StockStatusBadge = ({ status, quantity, reorderLevel }) => {
  let resolvedStatus = status;

  if (!resolvedStatus && quantity !== undefined && reorderLevel !== undefined) {
    if (quantity <= 0) resolvedStatus = 'OUT_OF_STOCK';
    else if (quantity <= reorderLevel) resolvedStatus = 'LOW_STOCK';
    else resolvedStatus = 'IN_STOCK';
  }

  switch (resolvedStatus) {
    case 'IN_STOCK':
      return (
        <span className="stock-badge badge-in-stock">
          <span className="stock-badge-dot" />
          In Stock
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className="stock-badge badge-low-stock">
          <span className="stock-badge-dot" />
          Low Stock
        </span>
      );
    case 'OUT_OF_STOCK':
      return (
        <span className="stock-badge badge-out-of-stock">
          <span className="stock-badge-dot" />
          Out of Stock
        </span>
      );
    default:
      return (
        <span className="stock-badge">
          {status || 'Unknown'}
        </span>
      );
  }
};

export const MovementBadge = ({ type }) => {
  const isStockIn = type === 'IN' || type === 'Stock In';
  return (
    <span className={isStockIn ? 'badge-movement-in' : 'badge-movement-out'}>
      {isStockIn ? 'Stock In' : 'Stock Out'}
    </span>
  );
};

export default StockStatusBadge;

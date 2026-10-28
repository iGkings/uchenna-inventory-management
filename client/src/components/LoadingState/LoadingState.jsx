import React from 'react';
import './LoadingState.css';

export const LoadingState = ({ message = 'Loading inventory data...' }) => {
  return (
    <div className="loading-container" role="status">
      <div className="spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="table-skeleton-wrapper" style={{ padding: '16px' }}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="skeleton"
              style={{
                height: '24px',
                flex: cIdx === 0 ? 2 : 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingState;

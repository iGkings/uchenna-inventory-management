import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StockStatusBadge from '../components/StockStatusBadge/StockStatusBadge';

describe('StockStatusBadge Component', () => {
  it('renders "Out of Stock" when quantity is 0', () => {
    render(<StockStatusBadge quantity={0} reorderLevel={10} />);
    expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
  });

  it('renders "Low Stock" when quantity is above zero and <= reorderLevel', () => {
    render(<StockStatusBadge quantity={5} reorderLevel={10} />);
    expect(screen.getByText(/Low Stock/i)).toBeInTheDocument();
  });

  it('renders "In Stock" when quantity exceeds reorderLevel', () => {
    render(<StockStatusBadge quantity={25} reorderLevel={10} />);
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
  });
});

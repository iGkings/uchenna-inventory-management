/**
 * Branding and System Constants for iGkings Innovation
 * All branding assets and company metadata are configured here for easy updating.
 */

export const BRAND = {
  name: 'iGkings Innovation',
  systemName: 'Uchenna Inventory Management System',
  owner: 'Uchenna',
  tagline: 'SYSTEMS • WEB • CREATIVE SOLUTIONS',
  // Configurable single logo asset path
  logoUrl: '/images/igkings-logo.png',
  logoSquareUrl: '/images/igkings-logo.png',
  faviconUrl: '/images/igkings-logo.png',
  version: 'v1.0.0 (Capstone Edition)',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STOCK_STATUS = {
  IN_STOCK: {
    label: 'In Stock',
    code: 'IN_STOCK',
    variant: 'success',
  },
  LOW_STOCK: {
    label: 'Low Stock',
    code: 'LOW_STOCK',
    variant: 'warning',
  },
  OUT_OF_STOCK: {
    label: 'Out of Stock',
    code: 'OUT_OF_STOCK',
    variant: 'danger',
  },
};

export const MOVEMENT_TYPES = {
  IN: {
    label: 'Stock In',
    color: '#159A63',
    bg: '#ECFDF5',
  },
  OUT: {
    label: 'Stock Out',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  ADJUSTMENT: {
    label: 'Correction',
    color: '#D97706',
    bg: '#FFFBEB',
  },
};

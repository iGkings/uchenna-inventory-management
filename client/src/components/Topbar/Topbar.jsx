import React from 'react';
import { Menu, Plus, Download, LayoutDashboard, Boxes, FolderKanban } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import './Topbar.css';

export const Topbar = ({
  title = 'Dashboard',
  icon: Icon = LayoutDashboard,
  onOpenMobileMenu,
  onExport,
  onAddProduct,
  lastUpdated,
}) => {
  return (
    <header className="topbar-header">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-toggle"
          onClick={onOpenMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-title-group">
          {Icon && (
            <span className="topbar-page-icon">
              <Icon size={18} />
            </span>
          )}
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-timestamp">
          Last updated {formatDateTime(lastUpdated || new Date())}
        </div>

        <div className="topbar-actions">
          {onExport && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onExport}
              title="Export to CSV"
            >
              <Download size={15} />
              <span>Export</span>
            </button>
          )}

          {onAddProduct && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddProduct}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  FolderKanban,
  ArrowLeftRight,
  LogOut,
  Warehouse,
  Sparkles,
  X,
} from 'lucide-react';
import { BRAND } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import SearchBar from '../SearchBar/SearchBar';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose, onQuickSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar-aside ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo-container" onClick={onClose}>
          <img
            src={BRAND.logoUrl}
            alt={BRAND.name}
            className="sidebar-logo-img"
          />
        </NavLink>
        <button
          type="button"
          className="sidebar-close-mobile"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-search-wrapper">
        <SearchBar
          placeholder="Quick search..."
          value=""
          onChange={(val) => {
            if (val) {
              navigate(`/products?search=${encodeURIComponent(val)}`);
              if (onClose) onClose();
            }
          }}
          showShortcut={true}
        />
      </div>

      <div className="sidebar-nav-section">
        <div className="sidebar-nav-group-title">Main Menu</div>
        <nav className="sidebar-nav-list">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Boxes size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FolderKanban size={18} />
            <span>Categories</span>
          </NavLink>
        </nav>

        <div className="sidebar-nav-group-title">Warehouses</div>
        <div className="sidebar-nav-list">
          <div className="warehouse-item">
            <Warehouse size={16} />
            <span>Main Warehouse</span>
          </div>
          <div className="warehouse-item">
            <Warehouse size={16} />
            <span>East Warehouse</span>
          </div>
          <div className="warehouse-item">
            <Warehouse size={16} />
            <span>West Warehouse</span>
          </div>
        </div>
      </div>

      <div className="sidebar-promo-card">
        <div className="promo-badge-crown">
          <Sparkles size={16} />
        </div>
        <div className="promo-title">iGkings Innovation</div>
        <p className="promo-desc">
          Enterprise Inventory Management System Capstone Edition.
        </p>
        <button
          type="button"
          className="promo-btn"
          onClick={() => navigate('/products')}
        >
          Manage Stock
        </button>
      </div>

      <div className="sidebar-user-footer">
        <div className="user-info-row">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-text-col">
            <span className="user-name">{user?.name || 'Uchenna'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

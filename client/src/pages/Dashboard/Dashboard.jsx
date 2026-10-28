import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import StatCard from '../../components/StatCard/StatCard';
import InventoryMovementChart from '../../features/dashboard/InventoryMovementChart';
import WarehouseCard from '../../features/dashboard/WarehouseCard';
import StockAdjustModal from '../../features/products/StockAdjustModal';
import { MovementBadge } from '../../components/StockStatusBadge/StockStatusBadge';
import { formatCompactNumber, formatDate, formatNumber } from '../../utils/formatters';
import dashboardService from '../../services/dashboardService';
import LoadingState from '../../components/LoadingState/LoadingState';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const refreshTrigger = outletContext?.refreshTrigger || 0;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movementSearch, setMovementSearch] = useState('');
  const [adjustModalProduct, setAdjustModalProduct] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading && !stats) {
    return <LoadingState message="Loading live inventory analytics and metrics..." />;
  }

  const summary = stats?.summary || {
    totalProducts: 1240,
    lowStockCount: 86,
    pendingOrdersCount: 52,
    totalInventoryValue: 28000000,
  };

  const filteredMovements = (stats?.recentMovements || []).filter((m) => {
    if (!movementSearch.trim()) return true;
    const term = movementSearch.toLowerCase();
    return (
      m.productName.toLowerCase().includes(term) ||
      m.sku.toLowerCase().includes(term) ||
      m.performedBy.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-root">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <h2 className="welcome-heading">Welcome {user?.name || 'Uchenna'}!</h2>
        <p className="welcome-subtitle">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* 4 Stat Cards in a row matching reference screenshot */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Products"
          value={formatNumber(summary.totalProducts)}
          icon={Package}
          variant="default"
        />

        <StatCard
          title="Low Stock Items"
          value={formatNumber(summary.lowStockCount)}
          icon={AlertTriangle}
          variant="warning"
        />

        <StatCard
          title="Pending Orders"
          value={formatNumber(summary.pendingOrdersCount)}
          icon={ClipboardList}
          variant="default"
        />

        <StatCard
          title="Inventory Value"
          value={formatCompactNumber(summary.totalInventoryValue)}
          icon={BarChart3}
          variant="green"
        />
      </div>

      {/* Low-Stock Quick Alert Banner if low stock items exist */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="stock-alert-section">
          <div className="alert-info-group">
            <div className="alert-icon-circle">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="alert-title">
                Attention Required: {stats.lowStockProducts.length} items have fallen below safety threshold
              </div>
              <div className="alert-desc">
                {stats.lowStockProducts.map((p) => `${p.name} (${p.quantity} left)`).join(', ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/products?status=LOW_STOCK')}
          >
            <span>Review Low Stock Items</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Middle Row: Inventory Movement Chart + Recent Stock Movements */}
      <div className="dashboard-middle-grid">
        <InventoryMovementChart data={stats?.movementChartData || []} />

        <div className="recent-movements-card">
          <div className="movements-header">
            <h3 className="movements-title">Recent Stock Movements</h3>

            <div className="movements-search-box">
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={13}
                  style={{ position: 'absolute', left: '8px', top: '7px', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="movements-search-input"
                  value={movementSearch}
                  onChange={(e) => setMovementSearch(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '4px' }}
                title="Filter movements"
              >
                <Filter size={14} color="#667085" />
              </button>
            </div>
          </div>

          <div className="movements-table-wrapper">
            <table className="movements-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.slice(0, 5).map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="product-cell">
                        {m.imageUrl ? (
                          <img src={m.imageUrl} alt={m.productName} className="product-thumb" />
                        ) : (
                          <div className="product-thumb-placeholder">
                            <Boxes size={14} />
                          </div>
                        )}
                        <span className="product-name-txt">{m.productName}</span>
                      </div>
                    </td>
                    <td>
                      <MovementBadge type={m.type} />
                    </td>
                    <td>
                      <span className={m.quantity >= 0 ? 'qty-pill-in' : 'qty-pill-out'}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td style={{ color: '#667085' }}>
                      {formatDate(m.date)}
                    </td>
                    <td>
                      {m.userAvatar ? (
                        <img src={m.userAvatar} alt={m.performedBy} className="user-avatar-tiny" />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {m.performedBy ? m.performedBy.charAt(0) : 'U'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Warehouse Overview Section matching reference screenshot */}
      <div>
        <div className="warehouse-section-header">
          <h3 className="warehouse-section-title">Warehouse Overview</h3>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '4px 12px' }}
            onClick={() => navigate('/products')}
          >
            View all
          </button>
        </div>

        <div className="warehouse-grid">
          {(stats?.warehouseOverview || []).map((wh, idx) => (
            <WarehouseCard key={idx} {...wh} />
          ))}
        </div>
      </div>

      {/* Quick stock adjustment modal */}
      {adjustModalProduct && (
        <StockAdjustModal
          isOpen={!!adjustModalProduct}
          onClose={() => setAdjustModalProduct(null)}
          product={adjustModalProduct}
          onSuccess={fetchStats}
        />
      )}
    </div>
  );
};

export default Dashboard;

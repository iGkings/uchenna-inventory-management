import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import ProductModal from '../../features/products/ProductModal';
import productService from '../../services/productService';
import { downloadFile } from '../../utils/exportCsv';
import useToast from '../../hooks/useToast';
import './AppLayout.css';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  const toast = useToast();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/products':
        return { title: 'Products Inventory' };
      case '/categories':
        return { title: 'Category Management' };
      case '/dashboard':
      default:
        return { title: 'Dashboard' };
    }
  };

  const handleExportCsv = async () => {
    try {
      toast.info('Preparing CSV export...');
      const csvData = await productService.exportCsv();
      const filename = `igkings-inventory-${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(csvData, filename);
      toast.success('Inventory CSV exported successfully.');
    } catch (err) {
      toast.error('Failed to export inventory CSV.');
    }
  };

  const handleAddProductSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const { title } = getPageMeta();

  return (
    <div className="app-layout-root">
      <div
        className={`layout-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="layout-main-area">
        <Topbar
          title={title}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onExport={handleExportCsv}
          onAddProduct={() => setAddProductModalOpen(true)}
          lastUpdated={new Date()}
        />

        <main className="layout-page-content">
          <Outlet context={{ refreshTrigger, openAddProduct: () => setAddProductModalOpen(true) }} />
        </main>
      </div>

      <ProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onSuccess={handleAddProductSuccess}
      />
    </div>
  );
};

export default AppLayout;

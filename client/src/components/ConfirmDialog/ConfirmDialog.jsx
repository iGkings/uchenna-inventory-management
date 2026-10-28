import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import Modal from '../Modal/Modal';
import './ConfirmDialog.css';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-accent'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="confirm-dialog-content">
        <div className={`confirm-icon-wrapper ${variant === 'danger' ? 'confirm-icon-danger' : 'confirm-icon-warning'}`}>
          {variant === 'danger' ? <AlertCircle size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div className="confirm-text-group">
          <p className="confirm-message">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

import React from 'react';
import { PackageOpen } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records matching your current filter criteria.',
  action = null,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-box">
        <Icon size={26} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;

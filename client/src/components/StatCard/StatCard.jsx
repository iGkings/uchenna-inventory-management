import React from 'react';
import './StatCard.css';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // default, orange, green, warning, danger
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>
      {Icon && (
        <div className={`stat-card-icon-container icon-${variant}`}>
          <Icon size={24} strokeWidth={1.8} />
        </div>
      )}
    </div>
  );
};

export default StatCard;

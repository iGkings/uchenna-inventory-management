import React from 'react';
import { MapPin, MoreVertical } from 'lucide-react';
import './DashboardWidgets.css';

export const WarehouseCard = ({
  name,
  location,
  productsCount,
  capacity,
  percentage,
  imageUrl,
}) => {
  return (
    <div className="warehouse-card">
      <div className="warehouse-img-container">
        <img src={imageUrl} alt={name} className="warehouse-img" />
        <span className="warehouse-location-pill">
          <MapPin size={11} />
          {location.split(' ')[0]}
        </span>
      </div>

      <div className="warehouse-card-body">
        <div className="warehouse-name-row">
          <div>
            <div className="warehouse-name">{name}</div>
            <div className="warehouse-location-sub">{location}</div>
          </div>
          <button type="button" className="btn-ghost" style={{ padding: '2px' }} aria-label="Warehouse options">
            <MoreVertical size={14} color="#94A3B8" />
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: '#667085', marginBottom: '4px' }}>
            {percentage}%
          </div>
          <div className="capacity-progress-bar-bg">
            <div
              className="capacity-progress-bar-fill"
              style={{
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: percentage > 75 ? '#FF941F' : '#06274B',
              }}
            />
          </div>
        </div>

        <div className="warehouse-stats-row">
          <div className="wh-stat-col">
            <span className="wh-stat-lbl">Products</span>
            <span className="wh-stat-val">{productsCount}</span>
          </div>
          <div className="wh-stat-col" style={{ textAlign: 'right' }}>
            <span className="wh-stat-lbl">Capacity</span>
            <span className="wh-stat-val">{capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCard;

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './DashboardWidgets.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-title">{label} 2026</p>
        <div className="tooltip-row">
          <span className="tooltip-dot dot-in" />
          <span>Stock In: <strong>{payload[0]?.value} units</strong></span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-dot dot-out" />
          <span>Stock Out: <strong>{payload[1]?.value} units</strong></span>
        </div>
      </div>
    );
  }
  return null;
};

export const InventoryMovementChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('Jan - Jun');

  return (
    <div className="card dashboard-chart-card">
      <div className="chart-card-header">
        <h3 className="chart-title">Inventory Movement</h3>

        <div className="chart-header-right">
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-indicator indicator-in" /> Stock In
            </span>
            <span className="legend-item">
              <span className="legend-indicator indicator-out" /> Stock Out
            </span>
          </div>

          <select
            className="chart-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="Jan - Jun">Jan - Jun</option>
            <option value="Jul - Dec">Jul - Dec</option>
            <option value="Full Year">Full Year</option>
          </select>
        </div>
      </div>

      <div className="chart-render-area">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            barSize={18}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9F0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#E4E9F0' }}
              tick={{ fill: '#667085', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#667085', fontSize: 12 }}
              domain={[0, 1000]}
              ticks={[0, 250, 500, 750, 1000]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Green for Stock In, Orange/Navy for Stock Out matching brand */}
            <Bar dataKey="stockIn" fill="#159A63" radius={[4, 4, 0, 0]} />
            <Bar dataKey="stockOut" fill="#06274B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryMovementChart;

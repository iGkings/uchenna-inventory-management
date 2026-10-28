import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import LoadingState, { TableSkeleton } from '../LoadingState/LoadingState';
import EmptyState from '../EmptyState/EmptyState';
import './DataTable.css';

export const DataTable = ({
  columns,
  data,
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There is no data to display right now.',
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}) => {
  if (loading) {
    return (
      <div className="table-wrapper">
        <TableSkeleton rows={6} cols={columns.length} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortBy === column.key) {
      return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    }
    return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={col.sortable ? 'is-sortable' : ''}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="th-content">
                  <span>{col.label}</span>
                  {renderSortIcon(col)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              onClick={() => onRowClick && onRowClick(row)}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

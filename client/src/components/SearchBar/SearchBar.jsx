import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  showShortcut = false,
  className = '',
}) => {
  return (
    <div className={`search-bar-container ${className}`}>
      <span className="search-bar-icon">
        <Search size={16} />
      </span>
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      <div className="search-bar-actions">
        {value ? (
          <button
            type="button"
            className="search-bar-clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : showShortcut ? (
          <kbd className="search-shortcut-badge">/</kbd>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;

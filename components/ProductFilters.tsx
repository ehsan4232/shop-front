'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { debounce } from 'lodash';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  filterGroups: FilterGroup[];
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onSearch,
  onFilter,
  filterGroups,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (groupId: string, value: any, type: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'checkbox') {
        if (!newFilters[groupId]) {
          newFilters[groupId] = [];
        }
        
        const currentValues = newFilters[groupId] as string[];
        const index = currentValues.indexOf(value);
        
        if (index > -1) {
          newFilters[groupId] = currentValues.filter((_, i) => i !== index);
        } else {
          newFilters[groupId] = [...currentValues, value];
        }
        
        // Remove empty arrays
        if (newFilters[groupId].length === 0) {
          delete newFilters[groupId];
        }
      } else {
        if (value === null || value === undefined || value === '') {
          delete newFilters[groupId];
        } else {
          newFilters[groupId] = value;
        }
      }
      
      return newFilters;
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value !== null && value !== undefined && value !== '') {
        count += 1;
      }
    });
    return count;
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    
    return (
      <div key={group.id} className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleGroup(group.id)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="font-medium text-gray-900">{group.label}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-2">
            {group.type === 'checkbox' && group.options && (
              <div className="space-y-2">
                {group.options.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters[group.id] || []).includes(option.id)}
                      onChange={(e) => handleFilterChange(group.id, option.id, 'checkbox')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                      {option.count && (
                        <span className="ml-1 text-gray-500">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {group.type === 'radio' && group.options && (
              <div className="space-y-2">
                {group.options.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={group.id}
                      checked={filters[group.id] === option.id}
                      onChange={() => handleFilterChange(group.id, option.id, 'radio')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                      {option.count && (
                        <span className="ml-1 text-gray-500">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {group.type === 'range' && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={group.min}
                  max={group.max}
                  step={group.step || 1}
                  value={filters[group.id] || group.min}
                  onChange={(e) => handleFilterChange(group.id, Number(e.target.value), 'range')}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{group.min}</span>
                  <span>{filters[group.id] || group.min}</span>
                  <span>{group.max}</span>
                </div>
              </div>
            )}
            
            {group.type === 'select' && group.options && (
              <select
                value={filters[group.id] || ''}
                onChange={(e) => handleFilterChange(group.id, e.target.value, 'select')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All {group.label}</option>
                {group.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                    {option.count && ` (${option.count})`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`space-y-0 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="mb-4 rounded-md bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Active Filters</span>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([groupId, value]) => {
                const group = filterGroups.find(g => g.id === groupId);
                if (!group) return null;
                
                if (Array.isArray(value)) {
                  return value.map(v => {
                    const option = group.options?.find(o => o.id === v);
                    return (
                      <span
                        key={`${groupId}-${v}`}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                      >
                        {option?.label || v}
                        <button
                          onClick={() => handleFilterChange(groupId, v, 'checkbox')}
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  });
                } else {
                  const option = group.options?.find(o => o.id === value);
                  return (
                    <span
                      key={groupId}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {option?.label || value}
                      <button
                        onClick={() => handleFilterChange(groupId, null, group.type)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        )}

        {/* Filter Groups */}
        <div className="divide-y divide-gray-200">
          {filterGroups.map(renderFilterGroup)}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
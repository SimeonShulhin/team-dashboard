'use client';

import { Search, Filter, X } from 'lucide-react';
import { Department, FilterState } from '@/types/index';

interface TeamFiltersProps {
  filters: FilterState;
  departments: Department[];
  onSearchChange: (search: string) => void;
  onDepartmentChange: (department: Department | 'all') => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function TeamFilters({
  filters,
  departments,
  onSearchChange,
  onDepartmentChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: TeamFiltersProps) {
  const hasActiveFilters = filters.search !== '' || filters.department !== 'all';

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6'>
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Пошук за іменем...'
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            />
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className='absolute inset-y-0 right-0 flex items-center px-2 z-10'>
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter */}
        <div className='lg:w-64'>
          <div className='relative'>
            <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <select
              value={filters.department}
              onChange={(e) => onDepartmentChange(e.target.value as Department | 'all')}
              className='w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white'>
              <option value='all'>Всі департаменти</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className='mt-4 flex items-center justify-between text-sm text-gray-600'>
        <div>
          {hasActiveFilters ? (
            <span>
              Показано {filteredCount} з {totalCount} співробітників
            </span>
          ) : (
            <span>Всього співробітників: {totalCount}</span>
          )}
        </div>

        {hasActiveFilters && (
          <div className='flex items-center space-x-4'>
            {filters.search && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                Пошук: "{filters.search}"
              </span>
            )}
            {filters.department !== 'all' && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                Департамент: {filters.department}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

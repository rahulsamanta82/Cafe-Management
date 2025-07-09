// src/components/ui/Pagination.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  showInfo?: boolean;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange,
  itemsPerPageOptions = [6, 12, 24, 48],
  showItemsPerPage = true,
  showInfo = true,
  className = ""
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalItems === 0) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-white border border-amber-100 rounded-lg p-4 ${className}`}>
      {/* Items per page selector */}
      {showItemsPerPage && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-amber-700">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-amber-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page info */}
      {showInfo && (
        <div className="text-sm text-amber-700">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* First page */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-amber-500">...</span>
              ) : (
                <Button
                  size="sm"
                  variant={currentPage === page ? "primary" : "ghost"}
                  onClick={() => onPageChange(page as number)}
                  className="min-w-[2rem] h-8"
                >
                  {page}
                </Button>
              )}
            </span>
          ))}
        </div>

        {/* Next page */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
// src/components/debug/ProductDebug.tsx
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ProductDebug() {
  const { products, resetData } = useApp();

  const handleResetData = () => {
    if (confirm('This will reset all data to initial state. Continue?')) {
      resetData();
      window.location.reload(); // Refresh to see changes
    }
  };

  const handleClearStorage = () => {
    if (confirm('This will clear all stored data. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800">🐛 Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-red-900">Products Status:</h4>
          <p className="text-sm text-red-700">
            Total products loaded: <strong>{products.length}</strong>
          </p>
          <p className="text-sm text-red-700">
            Approved products: <strong>{products.filter(p => p.status === 'approved').length}</strong>
          </p>
          <p className="text-sm text-red-700">
            Pending products: <strong>{products.filter(p => p.status === 'pending').length}</strong>
          </p>
        </div>

        <div>
          <h4 className="font-medium text-red-900">Storage Status:</h4>
          <p className="text-sm text-red-700">
            Products in localStorage: <strong>{localStorage.getItem('blumen_products') ? 'Yes' : 'No'}</strong>
          </p>
          <p className="text-sm text-red-700">
            Requests in localStorage: <strong>{localStorage.getItem('blumen_all_requests') ? 'Yes' : 'No'}</strong>
          </p>
        </div>

        <div>
          <h4 className="font-medium text-red-900">Sample Products:</h4>
          <div className="max-h-32 overflow-y-auto text-xs text-red-700 bg-white p-2 rounded border">
            {products.length > 0 ? (
              products.slice(0, 5).map(product => (
                <div key={product.id}>
                  {product.name} - {product.category} - Status: {product.status || 'approved'}
                </div>
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleResetData} variant="danger" size="sm">
            Reset Data
          </Button>
          <Button onClick={handleClearStorage} variant="outline" size="sm">
            Clear Storage
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="secondary" 
            size="sm"
          >
            Refresh Page
          </Button>
        </div>

        <div className="text-xs text-red-600">
          <strong>Note:</strong> This debug component should be removed in production.
        </div>
      </CardContent>
    </Card>
  );
}
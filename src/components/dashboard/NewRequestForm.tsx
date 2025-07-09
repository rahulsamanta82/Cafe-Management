// src/components/dashboard/NewRequestForm.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { ShoppingCart, Package, CheckCircle, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';

interface RequestItem {
  id: string;
  productId: string;
  orderQuantity: number;
  balanceQuantity: number;
  notes?: string;
}

export function NewRequestForm() {
  const { user } = useAuth();
  const { products, branches, requests, createProductRequest } = useApp();
  
  // Product selection states
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  // Form states
  const [orderQuantity, setOrderQuantity] = useState('');
  const [balanceQuantity, setBalanceQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showProductGrid, setShowProductGrid] = useState(false);

  const userBranch = branches.find(b => b.id === user?.branchId);

  // Filter out products that have been approved by main manager OR already added to current request
  const getAvailableProducts = () => {
    if (!user?.branchId) return products;

    // Get all requests for this branch that have been approved by main manager
    const mainManagerApprovedRequests = requests.filter(request => {
      if (request.branchId !== user.branchId) return false;
      
      // Check if main manager has approved this request in the approval history
      const mainManagerApproval = request.approvalHistory.find(step => 
        step.role === 'main_manager' && step.action === 'approved'
      );
      
      return mainManagerApproval !== undefined;
    });

    // Get product IDs that have been approved by main manager
    const approvedProductIds = new Set(
      mainManagerApprovedRequests.map(request => request.productId)
    );

    // Get product IDs that are already in the current request items
    const currentRequestProductIds = new Set(
      requestItems.map(item => item.productId)
    );

    // Filter out products that have been approved by main manager OR already added to current request
    return products.filter(product => 
      !approvedProductIds.has(product.id) && !currentRequestProductIds.has(product.id)
    );
  };

  const availableProducts = getAvailableProducts();

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchTerm, categoryFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(availableProducts.map(p => p.category).filter(Boolean)))];

  const addItem = () => {
    if (!selectedProduct || !orderQuantity) return;

    const newItem: RequestItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: selectedProduct,
      orderQuantity: parseInt(orderQuantity),
      balanceQuantity: parseInt(balanceQuantity) || 0,
      notes: notes || undefined
    };

    setRequestItems(prev => [...prev, newItem]);
    
    // Clear form
    setSelectedProduct('');
    setOrderQuantity('');
    setBalanceQuantity('');
    setNotes('');
    setShowProductGrid(false);
  };

  const removeItem = (itemId: string) => {
    setRequestItems(prev => prev.filter(item => item.id !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };

  const editItem = (item: RequestItem) => {
    setEditingItemId(item.id);
    setSelectedProduct(item.productId);
    setOrderQuantity(item.orderQuantity.toString());
    setBalanceQuantity(item.balanceQuantity.toString());
    setNotes(item.notes || '');
  };

  const updateItem = () => {
    if (!editingItemId || !selectedProduct || !orderQuantity) return;

    setRequestItems(prev => prev.map(item => 
      item.id === editingItemId 
        ? {
            ...item,
            productId: selectedProduct,
            orderQuantity: parseInt(orderQuantity),
            balanceQuantity: parseInt(balanceQuantity) || 0,
            notes: notes || undefined
          }
        : item
    ));

    // Clear form and exit edit mode
    setSelectedProduct('');
    setOrderQuantity('');
    setBalanceQuantity('');
    setNotes('');
    setEditingItemId(null);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setSelectedProduct('');
    setOrderQuantity('');
    setBalanceQuantity('');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!user || requestItems.length === 0) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create separate requests for each item
    for (const item of requestItems) {
      createProductRequest({
        productId: item.productId,
        branchId: user.branchId!,
        requestedBy: user.id,
        orderQuantity: item.orderQuantity,
        balanceQuantity: item.balanceQuantity,
        status: 'pending',
        currentApprover: 'main_manager',
        notes: item.notes
      });
    }

    // Reset form
    setRequestItems([]);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const selectProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductGrid(false);
  };

  if (user?.role !== 'branch_manager') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">Access Restricted</h3>
          <p className="text-amber-600">Only branch managers can create new requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Requests Submitted Successfully!</h3>
                <p className="text-sm text-green-700">
                  {requestItems.length} request(s) have been sent for approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900">New Product Request</h2>
        <p className="text-amber-700">Add multiple products to your request</p>
      </div>

      {/* Branch Info */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900">{userBranch?.name}</h3>
              <p className="text-sm text-amber-700">{userBranch?.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Request Items */}
      {requestItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Request Items ({requestItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestItems.map((item) => {
                const product = getProductById(item.productId);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex-1">
                      <div className="font-medium text-amber-900">{product?.name}</div>
                      <div className="text-sm text-amber-700">
                        {product?.category} • Qty: {item.orderQuantity} • Balance: {item.balanceQuantity}
                      </div>
                      {item.notes && (
                        <div className="text-sm text-amber-600 mt-1">Notes: {item.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => editItem(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>{editingItemId ? 'Edit Product' : 'Add Product'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableProducts.length === 0 && requestItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-amber-300" />
              <h3 className="text-lg font-medium text-amber-900 mb-2">No Products Available</h3>
              <p className="text-amber-600">
                All products have already been requested and approved for your branch.
              </p>
            </div>
          ) : availableProducts.length === 0 && requestItems.length > 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <p className="text-amber-600">
                All available products have been added to your request.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Select Product *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex-1 border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a product...</option>
                    {editingItemId && (
                      <option value={requestItems.find(item => item.id === editingItemId)?.productId}>
                        {getProductById(requestItems.find(item => item.id === editingItemId)?.productId || '')?.name} (Current)
                      </option>
                    )}
                    {availableProducts.slice(0, 20).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.category} (${product.basePrice.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowProductGrid(!showProductGrid)}
                  >
                    Browse All
                  </Button>
                </div>
                
                {availableProducts.length > 20 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Showing first 20 products in dropdown. Use "Browse All" to see all {availableProducts.length} products.
                  </p>
                )}
              </div>

              {/* Product Grid Browse */}
              {showProductGrid && (
                <Card className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Browse All Products</CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {paginatedProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => selectProduct(product.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedProduct === product.id
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-amber-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="font-medium text-amber-900 text-sm">{product.name}</div>
                          <div className="text-xs text-amber-600 mt-1">{product.category}</div>
                          <div className="text-sm font-bold text-amber-900 mt-2">${product.basePrice.toFixed(2)}</div>
                          {product.supplier && (
                            <div className="text-xs text-amber-500 mt-1">{product.supplier}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination for product grid */}
                    {totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={filteredProducts.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={setCurrentPage}
                          onItemsPerPageChange={setItemsPerPage}
                          itemsPerPageOptions={[8, 16, 24, 32]}
                        />
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={() => setShowProductGrid(false)}>
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Selected Product Details */}
              {selectedProduct && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  {(() => {
                    const product = getProductById(selectedProduct);
                    return product ? (
                      <div>
                        <h4 className="font-medium text-amber-900 mb-2">{product.name}</h4>
                        <p className="text-sm text-amber-700 mb-2">{product.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-amber-600">Category: {product.category}</span>
                          <span className="text-amber-600">Base Price: ${product.basePrice.toFixed(2)}</span>
                          {product.supplier && (
                            <Badge variant="default">{product.supplier}</Badge>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Quantities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Order Quantity *
                  </label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter quantity to order"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Current Balance Quantity
                  </label>
                  <input
                    type="number"
                    value={balanceQuantity}
                    onChange={(e) => setBalanceQuantity(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Current stock balance"
                    min="0"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Notes for this item
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes specific to this product..."
                />
              </div>

              {/* Add/Update Button */}
              <div className="flex justify-end space-x-4">
                {editingItemId && (
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel Edit
                  </Button>
                )}
                <Button
                  onClick={editingItemId ? updateItem : addItem}
                  disabled={!selectedProduct || !orderQuantity}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {editingItemId ? 'Update Item' : 'Add to Request'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit All Items */}
      {requestItems.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-amber-900">Ready to Submit</h3>
                <p className="text-sm text-amber-700">
                  {requestItems.length} item(s) will be sent for approval
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all items?')) {
                      setRequestItems([]);
                      setEditingItemId(null);
                      setSelectedProduct('');
                      setOrderQuantity('');
                      setBalanceQuantity('');
                      setNotes('');
                    }
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : `Submit ${requestItems.length} Request(s)`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-amber-700 text-sm mb-4">
              Each request will go through the following approval process:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Branch Manager',
                'Main Manager', 
                'Central Kitchen Manager',
                'Main Manager',
                'Inventory Manager',
                'Main Manager',
                'Supplier Manager',
                'Main Manager'
              ].map((role, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {role}
                  </div>
                  {index < 7 && (
                    <div className="mx-2 text-amber-400">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
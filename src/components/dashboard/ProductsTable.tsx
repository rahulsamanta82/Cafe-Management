// src/components/dashboard/ProductsTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/types';
import { formatDate, getRoleDisplayName } from '@/lib/utils';
import { 
  Package, 
  Plus, 
  Edit, 
  Search, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  XCircle,
  Eye,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

// Debug component - remove in production
function ProductDebug() {
  const { products, resetData } = useApp();

  const handleResetData = () => {
    if (confirm('This will reset all data to initial state. Continue?')) {
      resetData();
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
            Approved products: <strong>{products.filter(p => (p.status || 'approved') === 'approved').length}</strong>
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

        <Button onClick={handleResetData} variant="danger" size="sm">
          Reset & Reload Data
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProductsTable() {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, approveProduct, rejectProduct } = useApp();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Modal and form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject', productId: string } | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    basePrice: 0
  });

  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filtered products with search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Handle status filtering - treat missing status as 'approved'
      const productStatus = product.status || 'approved';
      const matchesStatus = statusFilter === 'all' || productStatus === statusFilter;
      
      // Role-based filtering
      if (user?.role === 'main_manager') {
        return matchesSearch && matchesCategory && matchesStatus;
      } else if (user?.role === 'branch_manager') {
        return matchesSearch && matchesCategory && matchesStatus && 
               (product.branchId === user.branchId || !product.branchId);
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, statusFilter, user]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, statusFilter, itemsPerPage]);

  const canManageProducts = user?.role === 'main_manager' || user?.role === 'inventory_manager' || user?.role === 'branch_manager';
  const canApproveProducts = (product: Product) => {
    return product.currentApprover === user?.role && (product.status || 'approved') === 'pending';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.basePrice > 0 && user) {
      addProduct(newProduct, user.id, user.branchId);
      setNewProduct({ name: '', category: '', description: '', basePrice: 0 });
      setShowAddForm(false);
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleApprovalAction = (type: 'approve' | 'reject', productId: string) => {
    setPendingAction({ type, productId });
    setShowApprovalModal(true);
  };

  const confirmApprovalAction = () => {
    if (!pendingAction || !user) return;

    if (pendingAction.type === 'approve') {
      approveProduct(pendingAction.productId, user.id, approvalNotes || undefined);
    } else {
      rejectProduct(pendingAction.productId, user.id, approvalNotes || undefined);
    }

    setApprovalNotes('');
    setShowApprovalModal(false);
    setPendingAction(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      default: return 'approved';
    }
  };

  return (
    <div className="space-y-6" id="products-section">
      {/* Debug Component - Remove in production */}
      <ProductDebug />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Products Catalog</h2>
          <p className="text-amber-700">
            Manage your cafe's product offerings ({filteredProducts.length} products)
          </p>
        </div>
        {canManageProducts && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Add Product Form */}
      {showAddForm && canManageProducts && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Beverages, Desserts, Pastries"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-900 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.basePrice}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                <Save className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const productStatus = product.status || 'approved';
              return (
                <Card key={product.id} className="hover:shadow-xl transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingProduct?.id === product.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="w-full text-lg font-semibold border border-amber-200 rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                              className="w-full text-sm border border-amber-200 rounded px-2 py-1"
                            />
                          </div>
                        ) : (
                          <>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <p className="text-sm text-amber-600 mt-1">{product.category}</p>
                            <div className="flex flex-wrap items-center gap-1 mt-2">
                              <Badge variant={getStatusBadgeVariant(productStatus)}>
                                {productStatus}
                              </Badge>
                              {product.currentApprover && (
                                <span className="text-xs text-amber-600">
                                  → {getRoleDisplayName(product.currentApprover)}
                                </span>
                              )}
                              {product.supplier && (
                                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                                  {product.supplier}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                          className="w-full text-sm border border-amber-200 rounded px-2 py-1"
                          rows={3}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct.basePrice}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, basePrice: parseFloat(e.target.value) || 0 } : null)}
                          className="w-full text-2xl font-bold border border-amber-200 rounded px-2 py-1"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleUpdateProduct}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-amber-700 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-amber-900">
                            ${product.basePrice.toFixed(2)}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedProduct(product)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {canApproveProducts(product) && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleApprovalAction('approve', product.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleApprovalAction('reject', product.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {canManageProducts && productStatus === 'approved' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[6, 12, 24, 48]}
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-amber-300" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">No products found</h3>
            <p className="text-amber-600">Try adjusting your search or filter criteria</p>
            {canManageProducts && (
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approval Modal */}
      {showApprovalModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{pendingAction.type === 'approve' ? 'Approve' : 'Reject'} Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={4}
                  placeholder={`Add notes for this ${pendingAction.type}al...`}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setPendingAction(null);
                    setApprovalNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={pendingAction.type === 'approve' ? 'secondary' : 'danger'}
                  onClick={confirmApprovalAction}
                >
                  {pendingAction.type === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-amber-700">Product Name</label>
                  <p className="text-amber-900 font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Category</label>
                  <p className="text-amber-900">{selectedProduct.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Base Price</label>
                  <p className="text-amber-900 font-medium">${selectedProduct.basePrice.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Status</label>
                  <Badge variant={getStatusBadgeVariant(selectedProduct.status || 'approved')}>
                    {selectedProduct.status || 'approved'}
                  </Badge>
                </div>
                {selectedProduct.supplier && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-amber-700">Supplier</label>
                    <p className="text-amber-900">{selectedProduct.supplier}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-amber-700">Description</label>
                <p className="text-amber-900 bg-amber-50 p-3 rounded-lg">{selectedProduct.description}</p>
              </div>

              {/* Approval History */}
              {selectedProduct.approvalHistory && selectedProduct.approvalHistory.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-amber-700 mb-3 block">Approval History</label>
                  <div className="space-y-3">
                    {selectedProduct.approvalHistory.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          step.action === 'approved' ? 'bg-green-100' : 
                          step.action === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {step.action === 'approved' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : step.action === 'rejected' ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-900">
                            {getRoleDisplayName(step.role)}
                          </div>
                          <div className="text-sm text-amber-700">
                            {step.action} • {formatDate(step.timestamp)}
                          </div>
                          {step.notes && (
                            <div className="text-sm text-amber-600 mt-1">{step.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-amber-100">
                {canApproveProducts(selectedProduct) && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedProduct(null);
                        handleApprovalAction('approve', selectedProduct.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedProduct(null);
                        handleApprovalAction('reject', selectedProduct.id);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}